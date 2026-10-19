const express = require('express');
const router = express.Router();
const {
  getAllMaintenance, getMaintenanceById, createMaintenance, updateMaintenance,
  closeMaintenance, deleteMaintenance
} = require('../controllers/maintenanceController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validateMiddleware');
const { maintenanceValidators, closeMaintenanceValidators } = require('../validators/maintenanceValidators');

router.use(protect);

router.route('/')
  .get(getAllMaintenance)
  .post(authorize('Fleet Manager', 'Dispatcher', 'Safety Officer'), maintenanceValidators, validate, createMaintenance);

router.route('/:id')
  .get(getMaintenanceById)
  .put(authorize('Fleet Manager', 'Safety Officer'), updateMaintenance)
  .delete(authorize('Fleet Manager'), deleteMaintenance);

router.post('/:id/close', authorize('Fleet Manager', 'Safety Officer'), closeMaintenanceValidators, validate, closeMaintenance);

module.exports = router;
