const express = require('express');
const tourController = require('../controllers/tourController');

const { createTour } = tourController;
const router = express.Router();

// router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
router.route('/').post(createTour);

module.exports = router;
