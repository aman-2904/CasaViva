const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview , isLoggedIn , isAuthor} = require("../middleware.js"); 


//Reviews ROUTE
router.post(
  "/",isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
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
  "/:reviewId",isLoggedIn,isAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
