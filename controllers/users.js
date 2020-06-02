const ErrorResponse = require('../services/errorResponse');
const aysncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc Get users
// @route POST /api/v1/auth/users
// @access Private/Admin
exports.getUsers = aysncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc Get one user
// @route POST /api/v1/auth/users/:id
// @access Private/Admin
exports.getUser = aysncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc Create User
// @route POST /api/v1/auth/users
// @access Private/Admin
exports.createUser = aysncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});

// @desc Update User
// @route Put /api/v1/auth/users/:id
// @access Private/Admin
exports.updateUser = aysncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc Update User
// @route Delete /api/v1/auth/users/:id
// @access Private/Admin
exports.deleteUser = aysncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});
