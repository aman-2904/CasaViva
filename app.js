const express = require("express");
const app = express();
const port = 3000;
const ejsmate = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const listings = require("./routes/listings");
const reviews = require("./routes/review");
const session = require("express-session");
const flash = require("connect-flash");

app.engine("ejs", ejsmate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/wanderlust");
}
main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

const sessionOptions = {
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!!"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  // res.status(status).send(message);
  res.status(status).render("error.ejs", { message });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
