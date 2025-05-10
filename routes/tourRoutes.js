const express = require('express');
const router = express.Router();
import {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} from '../controllers/tourController.js';

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
router.route('/').get(getAllTours).post(createTour);

module.exports = router;
