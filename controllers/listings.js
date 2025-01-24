const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// INDEX + SEARCH + CATEGORY FILTER
module.exports.index = async (req, res) => {
  const searchQuery = req.query.query || ""; // Get search query
  const category = req.query.category || ""; // Get category filter

  try {
    let listings;

    if (searchQuery || category) {
      // Filter by search query and/or category
      const filters = {};
      if (searchQuery) {
        filters.$or = [
          { location: { $regex: searchQuery, $options: "i" } }, // Case-insensitive match
          { country: { $regex: searchQuery, $options: "i" } },
        ];
      }
      if (category) {
        filters.category = category; // Match exact category
      }

      listings = await Listing.find(filters);
    } else {
      // Fetch all listings if no filters
      listings = await Listing.find();
    }

    // Render the index.ejs page with the listings and filters
    res.render("listings/index", {
      listings,
      searchQuery,
      category,
    });
  } catch (error) {
    console.error(error);
    res.render("listings/index", {
      listings: [],
      searchQuery: "",
      category: "",
      error: "Error fetching listings. Please try again later.",
    });
  }
};

//NEW
module.exports.new = (req, res) => {
  res.render("listings/new", {
    searchQuery: "",
    category: [
      "Trendings",
      "Rooms",
      "Iconic Cities",
      "Mountains",
      "Castles",
      "Amazing Pools",
      "Camping",
      "Farms",
      "Arctic",
    ],
  });
};

// CREATE
module.exports.create = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  let url = req.file.path;
  let filename = req.file.filename;
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
  newlisting.image = { url, filename };
  newlisting.geometry = response.body.features[0].geometry;
  let savedListing = await newlisting.save();
  console.log(savedListing);
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
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_300");
  res.render("listings/edit.ejs", {
    listing,
    originalImageUrl,
    searchQuery: "",
    category: [
      "Trendings",
      "Rooms",
      "Iconic Cities",
      "Mountains",
      "Castles",
      "Amazing Pools",
      "Camping",
      "Farms",
      "Arctic",
    ],
  });
};

//UPDATE
module.exports.update = async (req, res) => {
  let { id } = req.params;
  const { listing } = req.body;
  let updateListing = await Listing.findByIdAndUpdate(id, req.body.listing);

  // Ensure `image` is an object
  if (listing.image) {
    listing.image = {
      url: listing.image.url || "https://default-image-url.com/default.jpg",
      filename: listing.image.filename || "default.jpg",
    };
  }
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updateListing.image = { url, filename };
    await updateListing.save();
  }
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
  res.render("listings/show.ejs", {
    listing,
    searchQuery: "",
    category: [
      "Trendings",
      "Rooms",
      "Iconic Cities",
      "Mountains",
      "Castles",
      "Amazing Pools",
      "Camping",
      "Farms",
      "Arctic",
    ],
  });
};
