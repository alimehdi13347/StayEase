const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user");

// SIGNUP
router.route("/signup")  
  .get(userController.renderSignup)         // Render signup form
  .post(wrapAsync(userController.signup));  // Register new user

// LOGIN
router.route("/login")
  .get(userController.renderLogin)          // Render login form
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login                    // Handle login
  );

// LOGOUT
router.get("/logout", userController.logout); // Logout user

module.exports = router;
