const ErrorResponse = require('../services/errorResponse');
const aysncHandler = require('../middleware/async');
const Camp = require('../models/Camp');

// @desc Get all camps
// @route GET /api/v1/camps
// @access Public
exports.getCamps = aysncHandler(async (req, res, next) => {
  const camps = await Camp.find();
  res.status(200).json({ success: true, count: camps.length, data: camps });
});

// @desc Get a single camp
// @route GET /api/v1/camps/:id
// @access Public
exports.getCamp = aysncHandler(async (req, res, next) => {
  const camp = await Camp.findById(req.params.id);
  if (!camp) {
    return next(
      new ErrorResponse(`Camp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: camp });
});

// @desc Create new camp
// @route POST /api/v1/camps
// @access Private
exports.createCamp = aysncHandler(async (req, res, next) => {
  const camp = await Camp.create(req.body);
  res.status(201).json({
    success: true,
    data: camp,
  });
});

// @desc Update camp
// @route PUT /api/v1/camps/:id
// @access Private
exports.updateCamp = aysncHandler(async (req, res, next) => {
  const camp = await Camp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!camp) {
    return next(
      new ErrorResponse(`Camp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: camp });
});

// @desc Delete camp
// @route DELETE /api/v1/camps/:id
// @access Private
exports.deleteCamp = aysncHandler(async (req, res, next) => {
  const camp = await Camp.findByIdAndDelete(req.params.id);
  if (!camp) {
    return next(
      new ErrorResponse(`Camp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});
