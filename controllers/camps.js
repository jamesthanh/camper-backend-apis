const path = require('path');
const ErrorResponse = require('../services/errorResponse');
const aysncHandler = require('../middleware/async');
const geocoder = require('../services/geocoder');
const Camp = require('../models/Camp');

// @desc Get all camps
// @route GET /api/v1/camps
// @access Public
exports.getCamps = aysncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
  // Add User to req.body
  req.body.user = req.user.id;

  // Check for pulic camp
  const publicCamp = await Camp.findOne({ user: req.user.id });

  // If user is not an admin, they can only add 1 camp
  if (publicCamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already created a camp`,
        400
      )
    );
  }
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

// @desc Upload photo for  camps
// @route PUT /api/v1/camps/:id/photo
// @access Private
exports.uploadPhoto = aysncHandler(async (req, res, next) => {
  const camp = await Camp.findById(req.params.id);
  if (!camp) {
    return next(
      new ErrorResponse(`Camp not found with id of ${req.params.id}`, 404)
    );
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  const file = req.files.file;

  // Make sure that the upload file is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(
      new ErrorResponse(`The selected file is not a photo, please retry`, 400)
    );
  }
  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `The photo file is too large needs to be less than ${process.env.MAX_FILE_UPLOAD}, please retry`,
        400
      )
    );
  }

  // Create custom file name
  file.name = `photo_${camp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`File upload is not working`, 500));
    }
    await Camp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
