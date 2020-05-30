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

const Camp = require('../models/Camp');
const advancedResults = require('../middleware/advancedResults');

// Include other resource routes
const courseRouter = require('./courses');

const router = express.Router();

// Rerouting into other resource
router.use('/:campId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getCampsInRadius);

router.route('/:id/photo').put(uploadPhoto);

router
  .route('/')
  .get(advancedResults(Camp, 'courses'), getCamps)
  .post(createCamp);

router.route('/:id').get(getCamp).put(updateCamp).delete(deleteCamp);

module.exports = router;
