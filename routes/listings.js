const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, isHost, validateListing } = require("../middleware");
const listingController = require("../controllers/listings");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router.get("/", wrapAsync(listingController.index));

router.post(
  "/",
  isLoggedIn,
  isHost, // Only hosts can create
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.create)
);

router.get("/new", isLoggedIn, isHost, listingController.new);

router
  .route("/:id")
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.update)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroy))
  .get(wrapAsync(listingController.show));

// EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

module.exports = router;
