const express = require('express');

const {
  getCamps,
  getCamp,
  createCamp,
  updateCamp,
  deleteCamp,
} = require('../controllers/camps');
const router = express.Router();

router.route('/').get(getCamps).post(createCamp);

router.route('/:id').get(getCamp).put(updateCamp).delete(deleteCamp);

module.exports = router;
