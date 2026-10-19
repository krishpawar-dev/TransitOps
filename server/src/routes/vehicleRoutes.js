const express = require('express');
const router = express.Router();
const { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle, uploadDocument, deleteDocument } = require('../controllers/vehicleController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validateMiddleware');
const { vehicleValidators, vehicleUpdateValidators } = require('../validators/vehicleValidators');

// All vehicle routes require authentication
router.use(protect);

router.route('/')
  .get(getAllVehicles)
  .post(authorize('Fleet Manager', 'Safety Officer'), vehicleValidators, validate, createVehicle);

router.route('/:id')
  .get(getVehicleById)
  .put(authorize('Fleet Manager', 'Safety Officer'), vehicleUpdateValidators, validate, updateVehicle)
  .delete(authorize('Fleet Manager'), deleteVehicle);

// Document upload/delete
router.post('/:id/documents', authorize('Fleet Manager', 'Safety Officer'), uploadDocument);
router.delete('/:id/documents/:docId', authorize('Fleet Manager'), deleteDocument);

module.exports = router;
