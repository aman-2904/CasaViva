const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    price: Number,
    image: {
        url: {
            type: String,
            default: "https://media.cntraveler.com/photos/53da60a46dec627b149e66f4/master/w_1600%2Cc_limit/hilton-moorea-lagoon-resort-spa-moorea-french-poly--110160-1.jpg",
            set: (v) => v === "" ? "https://media.cntraveler.com/photos/53da60a46dec627b149e66f4/master/w_1600%2Cc_limit/hilton-moorea-lagoon-resort-spa-moorea-french-poly--110160-1.jpg" : v
        },
        filename: {
            type: String,
            default: "default.jpg"
        }
    },
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing; 