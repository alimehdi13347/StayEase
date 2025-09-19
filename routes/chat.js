const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const { isLogin } = require('../middleware');

router.get('/:id/chat', isLogin, async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate('owner');
  res.render('listing/chat', {
    listing,
    currUser: req.user
  });
});

module.exports = router;