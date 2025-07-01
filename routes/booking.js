const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware");
const bookingController = require("../controllers/booking");

router.post("/:id", isLoggedIn, bookingController.create); // POST /bookings/:id
router.post("/:id/confirm", isLoggedIn, bookingController.confirm);
router.post("/:id/reject", isLoggedIn, bookingController.reject);
router.get("/my", isLoggedIn, bookingController.myBookingsView);

router.post("/:id/cancel", isLoggedIn, bookingController.cancelBooking);


module.exports = router;
