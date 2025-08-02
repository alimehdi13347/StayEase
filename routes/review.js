const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controller/review");
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLogin, isAuthor } = require("../middleware");

// CREATE Review
router.post(
  "/",
  isLogin,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// DELETE Review
router.delete(
  "/:reviewId",
  isLogin,
  isAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
