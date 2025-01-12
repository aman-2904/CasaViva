const express = require("express");
const app = express();
const port = 3000;
const ejsmate = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./schema.js");


app.engine("ejs",ejsmate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));



async function main() {
    await mongoose.connect("mongodb://localhost:27017/wanderlust");
}
main().then(() => console.log("Connected to DB")).catch(err => console.log(err));

const validateListing =(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMessage = error.details.map(el => el.message).join(",");
        next(new ExpressError(400,errMessage));
    }else{
        next();
    }
}


app.get("/listings",wrapAsync(async(req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    }));

// NEW ROUTE

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

// CREATE ROUTE

app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
    let newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
})); 

// EDIT ROUTE
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
    }));

// UPDATE ROUTE
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing);
    res.redirect(`/listings/${id}`);
}));

// DELETE ROUTE
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


// SHOW ROUTE
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
    }));


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.all(("*"),(req,res,next)=>{
    next(new ExpressError(404,"Page not found!!"))
})

app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"}=err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs",{message})
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});