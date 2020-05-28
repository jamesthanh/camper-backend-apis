const express = require('express');

const {
  getCamps,
  getCamp,
  createCamp,
  updateCamp,
  deleteCamp,
  getCampsInRadius,
} = require('../controllers/camps');
const router = express.Router();
router.route('/radius/:zipcode/:distance').get(getCampsInRadius);

router.route('/').get(getCamps).post(createCamp);

router.route('/:id').get(getCamp).put(updateCamp).delete(deleteCamp);

module.exports = router;
