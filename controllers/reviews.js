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

// @desc Get review
// @route GET /api/v1/reviews/:id
// @access Public
exports.getReview = aysncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'camp',
    select: 'name description',
  });
  if (!review) {
    return next(
      new ErrorResponse(`No review with the ID of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc Add review
// @route POST /api/v1/camps/:campId/reviews
// @access Private
exports.addReview = aysncHandler(async (req, res, next) => {
  req.body.camp = req.params.campId;
  req.body.user = req.user.id;

  const camp = await Camp.findById(req.params.campId);
  if (!camp) {
    return next(
      new ErrorResponse(
        `No Camp found with the ID of ${req.params.campId}`,
        404
      )
    );
  }
  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc Update review
// @route PUT /api/v1/reviews/:id
// @access Private
exports.updateReview = aysncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`No Review found with the ID of ${req.params.id}`, 404)
    );
  }
  // Check for the user owns the reviews for is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorize to update this review`, 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc Delete review
// @route Delete /api/v1/reviews/:id
// @access Private
exports.deleteReview = aysncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`No Review found with the ID of ${req.params.id}`, 404)
    );
  }
  // Check for the user owns the reviews for is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorize to update this review`, 401));
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
