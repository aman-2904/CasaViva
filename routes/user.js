const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

//SIGNUP
router
  .route("/signup/host")
  .get(userController.hostSignupForm)
  .post(wrapAsync(userController.hostSignup));

router
  .route("/signup/guest")
  .get(userController.guestSignupForm)
  .post(wrapAsync(userController.guestSignup));

// LOGIN
router
  .route("/login")
  .get(userController.loginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

// LOGOUT
router.get("/logout", userController.logout);

module.exports = router;
