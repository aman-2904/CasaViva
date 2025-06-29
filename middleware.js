const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Kindly login inorder to add a new listing.");
        return res.redirect("/login")
      }
      next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  };
  next();
}

module.exports.isOwner =async (req,res,next)=>{
  let { id } = req.params;
  let listingId = await Listing.findById(id);
    if(!listingId.owner.equals(res.locals.currUser._id)){
      req.flash("error", "Permission Denied");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMessage = error.details.map((el) => el.message).join(",");
    next(new ExpressError(400, errMessage));
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMessage = error.details.map((el) => el.message).join(",");
    next(new ExpressError(400, errMessage));
  } else {
    next();
  }
};

module.exports.isAuthor =async (req,res,next)=>{
  let { id , reviewId } = req.params;
  let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error", "Permission Denied");
      return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isHost = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "host") {
    return next();
  }
  req.flash("error", "You must be a host to access this page.");
  res.redirect("/login");
};

module.exports.isGuest = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "guest") {
    return next();
  }
  req.flash("error", "You must be a guest to access this page.");
  res.redirect("/login");
};
