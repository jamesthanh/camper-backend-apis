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

const { protect } = require('../middleware/auth');

// Rerouting into other resource
router.use('/:campId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getCampsInRadius);

router.route('/:id/photo').put(protect, uploadPhoto);

router
  .route('/')
  .get(advancedResults(Camp, 'courses'), getCamps)
  .post(protect, createCamp);

router
  .route('/:id')
  .get(getCamp)
  .put(protect, updateCamp)
  .delete(protect, deleteCamp);

module.exports = router;
