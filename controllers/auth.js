const ErrorResponse = require('../services/errorResponse');
const aysncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc Get all camps
// @route GET /api/v1/camps
// @access Public
exports.register = aysncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
});
