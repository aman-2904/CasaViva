const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.create = async (req, res) => {
  try {
    const listingId = req.params.id;
    const userId = req.user._id;
    const { checkIn, checkOut, guests } = req.body;

    const newCheckIn = new Date(checkIn);
    const newCheckOut = new Date(checkOut);

    // 🔒 Check for conflicts
    const conflict = await Booking.findOne({
      listing: listingId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        { checkIn: { $lt: newCheckOut }, checkOut: { $gt: newCheckIn } }
      ]
    });

    if (conflict) {
      req.flash("error", "This listing is already booked for the selected dates.");
      return res.redirect(`/listings/${listingId}`);
    }

    const booking = new Booking({
      listing: listingId,
      user: userId,
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      guests: parseInt(guests),
      status: "pending"
    });

    await booking.save();
    req.flash("success", "Reservation request submitted!");
    res.redirect(`/listings/${listingId}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong while booking.");
    res.redirect("back");
  }
};


module.exports.confirm = async (req, res) => {
  const { id } = req.params;
  await Booking.findByIdAndUpdate(id, { status: "confirmed" });
  req.flash("success", "Booking confirmed.");
  res.redirect("/host/dashboard");
};

module.exports.reject = async (req, res) => {
  const { id } = req.params;
  await Booking.findByIdAndUpdate(id, { status: "cancelled" });
  req.flash("error", "Booking rejected.");
  res.redirect("/host/dashboard");
};

module.exports.myBookingsView = async (req, res) => {
  const userId = req.user._id;

  const allBookings = await Booking.find({
    user: userId,
    status: { $ne: "cancelled" }, // Exclude cancelled bookings
  })
    .populate("listing")
    .sort({ checkIn: -1 })
    .limit(20);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = allBookings.filter(b => b.checkIn >= today);

  const oneDayBefore = new Date(today);
  oneDayBefore.setDate(oneDayBefore.getDate() + 1);

  const upcomingFormatted = upcoming.map(b => ({
    ...b._doc,
    checkInFormatted: b.checkIn.toLocaleDateString("en-IN", { year: 'numeric', month: 'short', day: 'numeric' }),
    checkOutFormatted: b.checkOut.toLocaleDateString("en-IN", { year: 'numeric', month: 'short', day: 'numeric' }),
    canCancel: b.checkIn >= oneDayBefore
  }));

  res.render("booking/my", { upcomingBookings: upcomingFormatted });
};

module.exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("listing");

  if (!booking || booking.user.toString() !== req.user._id.toString()) {
    req.flash("error", "Unauthorized action");
    return res.redirect("/booking/my"); 
  }

  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (booking.checkIn < tomorrow) {
    req.flash("error", "Cannot cancel within 24 hours of check-in");
    return res.redirect("/booking/my"); 
  }

  booking.status = "cancelled";
  await booking.save();
  req.flash("success", "Booking cancelled successfully");
  res.redirect("/booking/my");
};
