const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isLogin, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer')
const{storage}=require('../cloudConfig.js')
const upload = multer({ storage })


// ===================== ROUTES ===================== //

// Create form (placed before /:id to avoid conflict)
router.get("/new", isLogin, listingController.renderNewForm);

// Index and Create
router.route("/")
  .get(wrapAsync(listingController.index))                         // Show all listings
   .post(isLogin,upload.single("image"), validateListing, wrapAsync(listingController.createListing)); // Create listing

// Show, Update, Delete (grouped with chaining)
router.route("/:id")
  .get(wrapAsync(listingController.showListing))                  // Show one listing
  .put(isLogin, isOwner,upload.single("image"), validateListing, wrapAsync(listingController.updateListing)) // Update
  .delete(isLogin, isOwner, wrapAsync(listingController.deleteListing)); // Delete

// Edit form
router.get("/:id/edit", isLogin, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
