const express = require('express');
const router = express.Router();
const {
  getAllFuelLogs, getFuelLogById, createFuelLog, updateFuelLog,
  deleteFuelLog, getVehicleFuelEfficiency
} = require('../controllers/fuelController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validateMiddleware');
const { fuelLogValidators } = require('../validators/fuelExpenseValidators');

router.use(protect);

router.route('/')
  .get(getAllFuelLogs)
  .post(authorize('Fleet Manager', 'Dispatcher', 'Financial Analyst'), fuelLogValidators, validate, createFuelLog);

router.route('/:id')
  .get(getFuelLogById)
  .put(authorize('Fleet Manager', 'Financial Analyst'), updateFuelLog)
  .delete(authorize('Fleet Manager'), deleteFuelLog);

router.get('/vehicle/:vehicleId/efficiency', getVehicleFuelEfficiency);

module.exports = router;
