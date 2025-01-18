const mongoose = require("mongoose");
const review = require("./review");
const { ref } = require("joi");
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
    reviews: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    geometry:{
        type:{
            type: String ,
            enum : ['Point'], //"location.type" must be a "Point"
            required : true
        },
        coordinates : {
            type: [Number],
            required : true
        }
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id : {$in: listing.reviews}})
    }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing; 