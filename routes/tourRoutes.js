const express = require('express');
const tourController = require('../controllers/tourController');

const { createTour, getAllTours, getTour, updateTour } = tourController;
const router = express.Router();

router.route('/:id').get(getTour).patch(updateTour);
// router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
router.route('/').get(getAllTours).post(createTour);

module.exports = router;
