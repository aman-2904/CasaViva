const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing");

async function main() {
  await mongoose.connect("mongodb://localhost:27017/wanderlust");
}
main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

const initDb = async () => {
//   await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "6788e9cdd80cabcf23687a71",
  }));
  await Listing.insertMany(initdata.data);
};

initDb()
  .then(() => console.log("DB seeded"))
  .catch((err) => console.log(err));
