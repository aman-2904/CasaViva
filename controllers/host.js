const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.dashboard = async (req, res) => {
  const listings = await Listing.find({ owner: req.user._id }).populate("reviews");
  
  const bookings = await Booking.find({ listing: { $in: listings.map(l => l._id) } })
    .populate("listing")
    .populate("user", "username")  
    .sort({ createdAt: -1 });

  res.render("host/dashboard", {
    listings,
    bookings,
    currentUser: req.user
  });
};
