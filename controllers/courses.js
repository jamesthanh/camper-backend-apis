const ErrorResponse = require('../services/errorResponse');
const aysncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Camp = require('../models/Camp');

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

// @desc Get all courses
// @route GET /api/v1/course/:id
// @access Public
exports.getCourse = aysncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'camp',
    select: 'name description',
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc Add course
// @route POST /api/v1/camps/:campId/courses
// @access Private
exports.addCourse = aysncHandler(async (req, res, next) => {
  req.body.camp = req.params.campId;

  const camp = await Camp.findById(req.params.campId);

  if (!camp) {
    return next(
      new ErrorResponse(`No camp with the id of ${req.params.campId}`),
      404
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc update course
// @route PUT /api/v1/courses/:id
// @access Private
exports.updateCourse = aysncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.campId}`),
      404
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc delete course
// @route Delete /api/v1/courses/:id
// @access Private
exports.deleteCourse = aysncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.campId}`),
      404
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
