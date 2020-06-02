const ErrorResponse = require('../services/errorResponse');
const aysncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Camp = require('../models/Camp');

// @desc Get all reviews
// @route GET /api/v1/reviews
// @route GET /api/v1/camps/:campId/reviews
// @access Public
exports.getReviews = aysncHandler(async (req, res, next) => {
  if (req.params.campId) {
    const reviews = await Review.find({ camp: req.params.campId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});
