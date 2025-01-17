const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview , isLoggedIn , isAuthor} = require("../middleware.js"); 
const reviewController = require("../controllers/reviews");

//Reviews ROUTE
router.post(
  "/",isLoggedIn,
  validateReview,
  wrapAsync(reviewController.reviewCreation)
);

//DELETE REVIEW ROUTE
router.delete(
  "/:reviewId",isLoggedIn,isAuthor,
  wrapAsync(reviewController.reviewDeletion)
);

module.exports = router;
