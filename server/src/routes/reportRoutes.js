const express = require('express');
const router = express.Router();
const {
  fleetUtilizationReport, fuelEfficiencyReport, operationalCostReport,
  vehicleROIReport, monthlyReport
} = require('../controllers/reportController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

router.get('/fleet-utilization', fleetUtilizationReport);
router.get('/fuel-efficiency', fuelEfficiencyReport);
router.get('/operational-cost', operationalCostReport);
router.get('/vehicle-roi', vehicleROIReport);
router.get('/monthly', monthlyReport);

module.exports = router;
