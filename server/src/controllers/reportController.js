const reportService = require('../services/reportService');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

/**
 * GET /api/reports/fleet-utilization
 */
const fleetUtilizationReport = async (req, res, next) => {
  try {
    const data = await reportService.generateFleetUtilizationReport(req.query.from, req.query.to);

    if (req.query.export === 'csv') {
      const fields = ['registrationNumber', 'vehicleName', 'totalTrips', 'totalDistance', 'totalRevenue'];
      const csv = reportService.exportToCSV(data.vehicleBreakdown, fields);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="fleet-utilization.csv"');
      return res.send(csv);
    }

    if (req.query.export === 'pdf') {
      const pdf = await reportService.exportToPDF('Fleet Utilization Report', data.vehicleBreakdown, [
        { key: 'registrationNumber', label: 'Reg No' },
        { key: 'vehicleName', label: 'Vehicle' },
        { key: 'totalTrips', label: 'Trips' },
        { key: 'totalDistance', label: 'Distance (km)' },
        { key: 'totalRevenue', label: 'Revenue (₹)' },
      ]);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="fleet-utilization.pdf"');
      return res.send(pdf);
    }

    return new ApiResponse(200, 'Fleet utilization report', data).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reports/fuel-efficiency
 */
const fuelEfficiencyReport = async (req, res, next) => {
  try {
    const data = await reportService.generateFuelEfficiencyReport(req.query.from, req.query.to);

    if (req.query.export === 'csv') {
      const csv = reportService.exportToCSV(data.vehicles, ['registrationNumber', 'vehicleName', 'totalFuel', 'totalCost', 'avgEfficiency', 'costPerKm']);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="fuel-efficiency.csv"');
      return res.send(csv);
    }

    if (req.query.export === 'pdf') {
      const pdf = await reportService.exportToPDF('Fuel Efficiency Report', data.vehicles, [
        { key: 'registrationNumber', label: 'Reg No' },
        { key: 'vehicleName', label: 'Vehicle' },
        { key: 'totalFuel', label: 'Fuel (L)' },
        { key: 'totalCost', label: 'Cost (₹)' },
        { key: 'avgEfficiency', label: 'km/L' },
        { key: 'costPerKm', label: '₹/km' },
      ]);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="fuel-efficiency.pdf"');
      return res.send(pdf);
    }

    return new ApiResponse(200, 'Fuel efficiency report', data).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reports/operational-cost
 */
const operationalCostReport = async (req, res, next) => {
  try {
    const data = await reportService.generateOperationalCostReport(req.query.from, req.query.to);
    return new ApiResponse(200, 'Operational cost report', data).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reports/vehicle-roi
 */
const vehicleROIReport = async (req, res, next) => {
  try {
    const data = await reportService.generateVehicleROIReport(req.query.from, req.query.to);

    if (req.query.export === 'csv') {
      const csv = reportService.exportToCSV(data, ['registrationNumber', 'vehicleName', 'acquisitionCost', 'totalOperatingCost', 'totalTripRevenue', 'netRevenue', 'roi', 'totalTrips']);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="vehicle-roi.csv"');
      return res.send(csv);
    }

    if (req.query.export === 'pdf') {
      const pdf = await reportService.exportToPDF('Vehicle ROI Report', data, [
        { key: 'registrationNumber', label: 'Reg No' },
        { key: 'vehicleName', label: 'Vehicle' },
        { key: 'acquisitionCost', label: 'Acq. Cost (₹)' },
        { key: 'totalOperatingCost', label: 'Op. Cost (₹)' },
        { key: 'roi', label: 'ROI (%)' },
      ]);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="vehicle-roi.pdf"');
      return res.send(pdf);
    }

    return new ApiResponse(200, 'Vehicle ROI report', data).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reports/monthly?year=2025&month=7
 */
const monthlyReport = async (req, res, next) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;

    if (month < 1 || month > 12) return next(new ApiError(400, 'Month must be between 1 and 12'));

    const data = await reportService.generateMonthlyReport(year, month);
    return new ApiResponse(200, `Monthly report for ${month}/${year}`, data).send(res);
  } catch (err) {
    next(err);
  }
};

module.exports = { fleetUtilizationReport, fuelEfficiencyReport, operationalCostReport, vehicleROIReport, monthlyReport };
