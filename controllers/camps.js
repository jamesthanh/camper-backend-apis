const ErrorResponse = require('../services/errorResponse');
const aysncHandler = require('../middleware/async');
const geocoder = require('../services/geocoder');
const Camp = require('../models/Camp');

// @desc Get all camps
// @route GET /api/v1/camps
// @access Public
exports.getCamps = aysncHandler(async (req, res, next) => {
  let query;
  // Copy request query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryString = JSON.stringify(reqQuery);
  // Create operators
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  query = Camp.find(JSON.parse(queryString)).populate('courses');
  // select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Camp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Query executed
  const camps = await query;
  // Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res
    .status(200)
    .json({ success: true, count: camps.length, pagination, data: camps });
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
  const camp = await Camp.findById(req.params.id);
  if (!camp) {
    return next(
      new ErrorResponse(`Camp not found with id of ${req.params.id}`, 404)
    );
  }
  camp.remove();
  res.status(200).json({ success: true, data: {} });
});

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getCampsInRadius = aysncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const camps = await Camp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: camps.length,
    data: camps,
  });
});
