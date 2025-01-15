const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const { listingSchema, reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMessage = error.details.map((el) => el.message).join(",");
    next(new ExpressError(400, errMessage));
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// NEW ROUTE

router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// CREATE ROUTE

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const listingData = req.body.listing;

    // Ensure `image` is always an object with default properties
    if (!listingData.image) {
        listingData.image = {
            url: "https://media.cntraveler.com/photos/53da60a46dec627b149e66f4/master/w_1600%2Cc_limit/hilton-moorea-lagoon-resort-spa-moorea-french-poly--110160-1.jpg",
            filename: "default.jpg",
        };
    }
    let newlisting = new Listing(req.body.listing);
    await newlisting.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
  })
);

// EDIT ROUTE
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// UPDATE ROUTE
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const { listing } = req.body;

    // Ensure `image` is an object
    if (listing.image) {
      listing.image = {
        url: listing.image.url || "https://default-image-url.com/default.jpg",
        filename: listing.image.filename || "default.jpg",
      };
    }
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
  })
);

// DELETE ROUTE
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

// SHOW ROUTE
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

module.exports = router;
