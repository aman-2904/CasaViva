const Listing = require("../models/listing");
const Booking = require("../models/booking");
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

      listings = await Listing.find(filters).populate("reviews");
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
  try {
    // Check if file was uploaded
    if (!req.file) {
      req.flash("error", "Please upload an image for your listing");
      return res.redirect("/listings/new");
    }

    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    const listingData = req.body.listing;

    // Create new listing
    let newlisting = new Listing(listingData);
    newlisting.owner = req.user._id;
    newlisting.image = {
      url: req.file.path,
      filename: req.file.filename
    };
    
    // Add geometry from Mapbox
    if (response.body.features && response.body.features.length > 0) {
      newlisting.geometry = response.body.features[0].geometry;
    }

    let savedListing = await newlisting.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/host/dashboard");
  } catch (error) {
    console.error("Error creating listing:", error);
    req.flash("error", "Error creating listing. Please try again.");
    res.redirect("/listings/new");
  }
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
  
  try {
    let updateListing = await Listing.findByIdAndUpdate(id, listing, { new: true });

    // Update image if a new one was uploaded
    if (req.file) {
      updateListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
      await updateListing.save();
    }
    
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error("Error updating listing:", error);
    req.flash("error", "Error updating listing. Please try again.");
    res.redirect(`/listings/${id}/edit`);
  }
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
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "No such listing exists!");
    return res.redirect("/listings");
  }
  const existingBookings = await Booking.find(
    {
      listing: id,
      status: "confirmed",
    },
    "checkIn checkOut"
  );

  let booking = null;
  if (req.user) {
    booking = await Booking.findOne({
      listing: id,
      user: req.user._id,
      status: { $in: ["pending", "confirmed"] },
    }).sort({ createdAt: -1 });
  }

  res.render("listings/show.ejs", {
    listing,
    currUser: req.user,
    booking,
    existingBookings,
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