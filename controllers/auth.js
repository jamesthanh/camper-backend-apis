const ErrorResponse = require('../services/errorResponse');
const aysncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc Get all camps
// @route GET /api/v1/camps
// @access Public
exports.register = aysncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  // Create token
  const token = user.getSignedJwtToken();
  res.status(200).json({ success: true, token });
});
