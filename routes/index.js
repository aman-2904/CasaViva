// routes/index.js
const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");

router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find({});
    res.render("listings/home", { listings }); // ✅ pass listings to home.ejs
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "Something went wrong!" });
  }
});

module.exports = router;
