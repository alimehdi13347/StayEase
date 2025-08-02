const express=require("express");
const router=express.Router();;
const wrapAsync=require("../utils/wrapAsync")
const Listing=require("../models/listing");

router.post("/", wrapAsync(async (req, res) => {
  const { search } = req.body;

  // Case-insensitive partial search for both country and location
  const listings = await Listing.find({
    $or: [
      { country: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } }
    ]
  });

  // If nothing found, redirect to all listings
  if (listings.length === 0) {
    req.flash("error", "No results found.");
    return res.redirect("/listings");
  }

  // Otherwise, render search results
  res.render("listing/search.ejs", { listings, search });
}));
module.exports=router;