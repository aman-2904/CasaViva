const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware");
const bookingController = require("../controllers/booking");

router.post("/:id", isLoggedIn, bookingController.create); // POST /bookings/:id
router.post("/:id/confirm", isLoggedIn, bookingController.confirm);
router.post("/:id/reject", isLoggedIn, bookingController.reject);


module.exports = router;
