const express = require('express');
const router = express.Router();
const {
  getAllTrips, getTripById, createTrip, updateTrip, deleteTrip,
  dispatchTrip, completeTrip, cancelTrip
} = require('../controllers/tripController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validateMiddleware');
const { tripValidators, dispatchValidators, completeValidators, cancelValidators } = require('../validators/tripValidators');

router.use(protect);

router.route('/')
  .get(getAllTrips)
  .post(authorize('Fleet Manager', 'Dispatcher'), tripValidators, validate, createTrip);

router.route('/:id')
  .get(getTripById)
  .put(authorize('Fleet Manager', 'Dispatcher'), updateTrip)
  .delete(authorize('Fleet Manager'), deleteTrip);

// Trip lifecycle
router.post('/:id/dispatch', authorize('Fleet Manager', 'Dispatcher'), dispatchValidators, validate, dispatchTrip);
router.post('/:id/complete', authorize('Fleet Manager', 'Dispatcher'), completeValidators, validate, completeTrip);
router.post('/:id/cancel', authorize('Fleet Manager', 'Dispatcher'), cancelValidators, validate, cancelTrip);

module.exports = router;
