const Listing = require("../models/listing");
const getCoordinates = require('../utils/geocode');

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listing/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs");
};

module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const listingData = req.body.listing;
  const city = req.body.listing.location.trim();

  // 🔍 Get coordinates from OpenCage
  const coords = await getCoordinates(city);
  if (!coords) {
    req.flash("error", "Invalid city name. Please try again.");
    return res.redirect("/listings/new");
  }

  const listing = new Listing(listingData);
  listing.owner = req.user._id;
  listing.image = { url, filename };
  listing.location = city; // 🏙️ Store city name as string
  listing.coordinates = coords; // 📍 Store lat/lng object

  await listing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }
  res.render("listing/show.ejs", { listing,apiKey: process.env.API_KEY,currUser: req.user });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  // ✅ Correct image resizing URL
  let originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250");
  res.render("listing/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listingData = req.body.listing;

  // Step 1: Update basic details
  const listing = await Listing.findByIdAndUpdate(id, listingData, { new: true });

  // Step 2: Geocode new location if it was changed
  if (listingData.location) {
    const coords = await getCoordinates(listingData.location.trim());
    if (coords) {
      listing.coordinates = coords; // 📍 Update coordinates
    }
  }

  // Step 3: If a new image was uploaded, update it
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save(); // Save all changes
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};


module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};

