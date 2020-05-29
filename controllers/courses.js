const ErrorResponse = require('../services/errorResponse');
const aysncHandler = require('../middleware/async');
const Course = require('../models/Course');

// @desc Get all courses
// @route GET /api/v1/courses
// @route GET /api/v1/camps/:campId/courses
// @access Public
exports.getCourses = aysncHandler(async (req, res, next) => {
  let query;
  if (req.params.campId) {
    query = Course.find({ camp: req.params.campId });
  } else {
    query = Course.find().populate({
      // Show only specific fields of camps
      path: 'camp',
      select: 'name description',
    });
  }
  const courses = await query;
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});
