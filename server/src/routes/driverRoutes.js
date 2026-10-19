const express = require('express');
const router = express.Router();
const { getAllDrivers, getDriverById, createDriver, updateDriver, deleteDriver } = require('../controllers/driverController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validateMiddleware');
const { driverValidators, driverUpdateValidators } = require('../validators/driverValidators');

router.use(protect);

router.route('/')
  .get(getAllDrivers)
  .post(authorize('Fleet Manager', 'Safety Officer'), driverValidators, validate, createDriver);

router.route('/:id')
  .get(getDriverById)
  .put(authorize('Fleet Manager', 'Safety Officer'), driverUpdateValidators, validate, updateDriver)
  .delete(authorize('Fleet Manager'), deleteDriver);

module.exports = router;
