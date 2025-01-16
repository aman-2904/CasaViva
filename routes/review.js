const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review");
const Listing = require("../models/listing");
const { listingSchema, reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMessage = error.details.map((el) => el.message).join(",");
    next(new ExpressError(400, errMessage));
  } else {
    next();
  }
};

//Reviews ROUTE
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","Review Added!");
    console.log(newReview);
    res.redirect(`/listings/${req.params.id}`);
  })
);

//DELETE REVIEW ROUTE
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
