const ErrorResponse = require('../services/errorResponse');
const Camp = require('../models/Camp');

// @desc Get all camps
// @route GET /api/v1/camps
// @access Public
exports.getCamps = async (req, res, next) => {
  try {
    const camps = await Camp.find();
    res.status(200).json({ success: true, count: camps.length, data: camps });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc Get a single camp
// @route GET /api/v1/camps/:id
// @access Public
exports.getCamp = async (req, res, next) => {
  try {
    const camp = await Camp.findById(req.params.id);
    if (!camp) {
      return next(
        new ErrorResponse(`Camp not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: camp });
  } catch (err) {
    next(new ErrorResponse(`Camp not found with id of ${req.params.id}`, 404));
  }
};

// @desc Create new camp
// @route POST /api/v1/camps
// @access Private
exports.createCamp = async (req, res, next) => {
  try {
    const camp = await Camp.create(req.body);
    res.status(201).json({
      success: true,
      data: camp,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc Update camp
// @route PUT /api/v1/camps/:id
// @access Private
exports.updateCamp = async (req, res, next) => {
  try {
    const camp = await Camp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!camp) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: camp });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc Delete camp
// @route DELETE /api/v1/camps/:id
// @access Private
exports.deleteCamp = async (req, res, next) => {
  try {
    const camp = await Camp.findByIdAndDelete(req.params.id);
    if (!camp) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
