const ErrorResponse = require('../services/errorResponse');
const aysncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc Register user
// @route POST /api/v1/auth/register
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

// @desc Login user
// @route POST /api/v1/auth/login
// @access Public
exports.login = aysncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // // Create user
  // const user = await User.create({
  //   name,
  //   email,
  //   password,
  //   role,
  // });

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Email and password are required', 400));
  }
  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  // Check for password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Create token
  const token = user.getSignedJwtToken();
  res.status(200).json({ success: true, token });
});
