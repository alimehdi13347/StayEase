const User = require("../models/user");

// Render Signup Form
module.exports.renderSignup = (req, res) => {
  res.render("./users/signup.ejs");
};

// Handle Signup
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Stay Ease!");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

// Render Login Form
module.exports.renderLogin = (req, res) => {
  res.render("./users/login.ejs");
};

// Handle Login (post-auth)
module.exports.login = (req, res) => {
  req.flash("success", "Welcome back to Stay Ease!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// Logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You have been logged out!");
    res.redirect("/listings");
  });
};
