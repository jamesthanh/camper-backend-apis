const express = require('express');

const {
  getCamps,
  getCamp,
  createCamp,
  updateCamp,
  deleteCamp,
  getCampsInRadius,
  uploadPhoto,
} = require('../controllers/camps');

// Include other resource routes
const courseRouter = require('./courses');

const router = express.Router();

// Rerouting into other resource
router.use('/:campId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getCampsInRadius);

router.route('/:id/photo').put(uploadPhoto);

router.route('/').get(getCamps).post(createCamp);

router.route('/:id').get(getCamp).put(updateCamp).delete(deleteCamp);

module.exports = router;
