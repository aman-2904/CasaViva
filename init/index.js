const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing");

async function main() {
    await mongoose.connect("mongodb://localhost:27017/wanderlust");
}
main().then(() => console.log("Connected to DB")).catch(err => console.log(err));


const initDb = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
}

initDb().then(() => console.log("DB seeded")).catch(err => console.log(err));