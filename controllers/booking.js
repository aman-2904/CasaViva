const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.create = async (req, res) => {
    try {
      const listingId = req.params.id;
      const userId = req.user._id;
  
      const { checkIn, checkOut, guests } = req.body;
  
      const booking = new Booking({
        listing: listingId,
        user: userId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
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