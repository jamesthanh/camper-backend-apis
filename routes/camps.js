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
const reviewRouter = require('./reviews');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Rerouting into other resource
router.use('/:campId/courses', courseRouter);
router.use('/:campId/reviews', reviewRouter);

router.route('/radius/:zipcode/:distance').get(getCampsInRadius);

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), uploadPhoto);

router
  .route('/')
  .get(advancedResults(Camp, 'courses'), getCamps)
  .post(protect, authorize('publisher', 'admin'), createCamp);

router
  .route('/:id')
  .get(getCamp)
  .put(protect, authorize('publisher', 'admin'), updateCamp)
  .delete(protect, authorize('publisher', 'admin'), deleteCamp);

module.exports = router;
