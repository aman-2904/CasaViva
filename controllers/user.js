const User = require("../models/user.js");

module.exports.hostSignupForm = (req, res) => {
  res.render("users/hostSignup");
};

module.exports.guestSignupForm = (req, res) => {
  res.render("users/guestSignup");
};

module.exports.hostSignup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, role: "host" });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome, Host!");
      res.redirect("/host/dashboard");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup/host");
  }
};

module.exports.guestSignup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, role: "guest" });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome, Guest!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup/guest");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust");
  const user = req.user;
  if (user.role === "host") {
    res.redirect("/host/dashboard");
  } else {
    res.redirect("/listings");
  }
};


module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next();
    }
    req.flash("success", "You are logged out!! ");
    res.redirect("/listings");
  });
};
