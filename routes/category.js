const express=require("express");
const router=express.Router({ mergeParams: true });;
const wrapAsync=require("../utils/wrapAsync")
const Listing=require("../models/listing");


router.get("/:filters", wrapAsync(async (req, res) => {
  let { filters } = req.params;

  const validCategories = [
    "trending", "rooms", "beach", "mountain", "forest",
    "iconic", "desert", "snow", "villas", "luxury"
  ];

  if (!validCategories.includes(filters)) {
    req.flash("error", "Invalid category selected");
    return res.redirect("/listings");
  }

  let listings = await Listing.find({ category: filters });
  res.render("listing/filters.ejs", { listings, filters });
}));

module.exports=router;