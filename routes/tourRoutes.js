const express = require('express');
const tourController = require('../controllers/tourController');

const { createTour, getAllTours, getTour, updateTour, deleteTour } =
  tourController;
const router = express.Router();

router.route('/top-5-cheap').get(tourController.aliasTopTours, getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
router.route('/').get(getAllTours).post(createTour);

module.exports = router;
