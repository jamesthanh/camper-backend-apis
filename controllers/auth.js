const crypto = require('crypto');
const ErrorResponse = require('../services/errorResponse');
const aysncHandler = require('../middleware/async');
const sendEmail = require('../services/sendEmail');
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
  sendTokenResponse(user, 200, res);
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

  sendTokenResponse(user, 200, res);
});

// @desc forgot password
// @route POST /api/v1/auth/forgotpassword
// @access Public
exports.forgotPassword = aysncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse('There is no user with entered email', 404));
  }
  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You need to reset password, make a PUT request to : \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });
    res.status(200).json({
      success: true,
      data: 'Email sent',
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Reset password failed', 500));
  }
});

// @desc Reset password
// @route PUT /api/v1/auth/resetpassword/:resettoken
// @access Public
exports.resetPassword = aysncHandler(async (req, res, next) => {
  // get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    return next(new ErrorResponse('Invalid Token', 400));
  }
  // set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
});

// @desc Get current logged in user
// @route POST /api/v1/auth/me
// @access Private
exports.getMe = aysncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc Update password
// @route POST /api/v1/auth/updatepassword
// @access Private
exports.updatePassword = aysncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is not valid', 401));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});

// @desc Update User Detail
// @route PUT /api/v1/auth/updatedetails
// @access Private
exports.updateDetails = aysncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};
