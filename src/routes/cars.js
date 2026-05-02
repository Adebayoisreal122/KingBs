const express = require('express');
const router = express.Router();
const { getCars, getCar, createCar, updateCar, deleteCar } = require('../controllers/carController');
const { protect } = require('../middleware/auth');

router.route('/').get(getCars).post(protect, createCar);
router.route('/:id').get(getCar).put(protect, updateCar).delete(protect, deleteCar);

module.exports = router;
