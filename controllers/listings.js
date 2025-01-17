const Listing = require("../models/listing");

//INDEX
module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

//NEW
module.exports.new = (req, res) => {
  res.render("listings/new.ejs");
};

// CREATE
module.exports.create = async (req, res, next) => {
  const listingData = req.body.listing;

  // Ensure `image` is always an object with default properties
  if (!listingData.image) {
    listingData.image = {
      url: "https://media.cntraveler.com/photos/53da60a46dec627b149e66f4/master/w_1600%2Cc_limit/hilton-moorea-lagoon-resort-spa-moorea-french-poly--110160-1.jpg",
      filename: "default.jpg",
    };
  }
  let newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  await newlisting.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

//EDIT
module.exports.edit = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "No such listing exists!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

//UPDATE
module.exports.update = async (req, res) => {
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
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

//DELETE
module.exports.destroy = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

//SHOW
module.exports.show = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "No such listing exists!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};
