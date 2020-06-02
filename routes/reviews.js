const express = require('express');
const { getReviews, getReview } = require('../controllers/reviews');
const Review = require('../models/Review');
const router = express.Router({ mergeParams: true });
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(
  advancedResults(Review, {
    // Show only specific fields of camps
    path: 'camp',
    select: 'name description',
  }),
  getReviews
);
router.route('/:id').get(getReview);

module.exports = router;
