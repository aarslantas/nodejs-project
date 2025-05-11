const express = require('express');
const tourController = require('../controllers/tourController.js');
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} = tourController;
const router = express.Router();

router.param('id', tourController.checkID);


router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
router.route('/').get(getAllTours).post(tourController.checkBody,createTour);

module.exports = router;
