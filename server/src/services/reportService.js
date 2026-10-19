const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const FuelLog = require('../models/FuelLog');
const Expense = require('../models/Expense');
const Maintenance = require('../models/Maintenance');
const { calculateROI, calculateFuelEfficiency, calculateFleetUtilization } = require('../utils/calculateROI');

/**
 * Generate Fleet Utilization Report
 */
const generateFleetUtilizationReport = async (from, to) => {
  const dateFilter = {};
  if (from) dateFilter.$gte = new Date(from);
  if (to) dateFilter.$lte = new Date(to);

  const [totalVehicles, activeVehicles, inShopVehicles, retiredVehicles, trips] = await Promise.all([
    Vehicle.countDocuments(),
    Vehicle.countDocuments({ status: { $in: ['Available', 'On Trip'] } }),
    Vehicle.countDocuments({ status: 'In Shop' }),
    Vehicle.countDocuments({ status: 'Retired' }),
    Trip.find(
      from || to ? { dispatchDate: dateFilter } : {}
    ).populate('vehicle driver', 'registrationNumber vehicleName name'),
  ]);

  const utilization = calculateFleetUtilization(activeVehicles, totalVehicles);

  // Per-vehicle breakdown
  const vehicleBreakdown = {};
  for (const trip of trips) {
    if (!trip.vehicle) continue;
    const id = trip.vehicle._id.toString();
    if (!vehicleBreakdown[id]) {
      vehicleBreakdown[id] = {
        registrationNumber: trip.vehicle.registrationNumber,
        vehicleName: trip.vehicle.vehicleName,
        totalTrips: 0,
        totalDistance: 0,
        totalRevenue: 0,
      };
    }
    vehicleBreakdown[id].totalTrips++;
    vehicleBreakdown[id].totalDistance += trip.actualDistance || 0;
    vehicleBreakdown[id].totalRevenue += trip.revenue || 0;
  }

  return {
    summary: { totalVehicles, activeVehicles, inShopVehicles, retiredVehicles, fleetUtilization: utilization },
    vehicleBreakdown: Object.values(vehicleBreakdown),
    totalTrips: trips.length,
  };
};

/**
 * Generate Fuel Efficiency Report
 */
const generateFuelEfficiencyReport = async (from, to) => {
  const dateFilter = {};
  if (from) dateFilter.$gte = new Date(from);
  if (to) dateFilter.$lte = new Date(to);

  const fuelLogs = await FuelLog.find(
    from || to ? { date: dateFilter } : {}
  ).populate('vehicle', 'registrationNumber vehicleName vehicleType');

  // Group by vehicle
  const vehicleData = {};
  for (const log of fuelLogs) {
    if (!log.vehicle) continue;
    const id = log.vehicle._id.toString();
    if (!vehicleData[id]) {
      vehicleData[id] = {
        registrationNumber: log.vehicle.registrationNumber,
        vehicleName: log.vehicle.vehicleName,
        vehicleType: log.vehicle.vehicleType,
        totalFuel: 0,
        totalCost: 0,
        totalDistance: 0,
        entries: 0,
      };
    }
    vehicleData[id].totalFuel += log.liters;
    vehicleData[id].totalCost += log.cost;
    vehicleData[id].totalDistance += log.distanceSinceLastFill || 0;
    vehicleData[id].entries++;
  }

  const results = Object.values(vehicleData).map((v) => ({
    ...v,
    avgEfficiency: calculateFuelEfficiency(v.totalDistance, v.totalFuel),
    costPerKm: v.totalDistance > 0 ? parseFloat((v.totalCost / v.totalDistance).toFixed(2)) : 0,
  }));

  const totalFuel = results.reduce((s, v) => s + v.totalFuel, 0);
  const totalCost = results.reduce((s, v) => s + v.totalCost, 0);

  return { summary: { totalFuel, totalFuelCost: totalCost, entries: fuelLogs.length }, vehicles: results };
};

/**
 * Generate Operational Cost Report
 */
const generateOperationalCostReport = async (from, to) => {
  const dateFilter = {};
  if (from) dateFilter.$gte = new Date(from);
  if (to) dateFilter.$lte = new Date(to);

  const expenses = await Expense.find(from || to ? { date: dateFilter } : {});

  // Group by category
  const byCategory = {};
  for (const exp of expenses) {
    if (!byCategory[exp.category]) byCategory[exp.category] = 0;
    byCategory[exp.category] += exp.amount;
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return {
    total,
    byCategory,
    expenseCount: expenses.length,
    averagePerExpense: expenses.length > 0 ? parseFloat((total / expenses.length).toFixed(2)) : 0,
  };
};

/**
 * Generate Vehicle ROI Report
 */
const generateVehicleROIReport = async (from, to) => {
  const dateFilter = {};
  if (from) dateFilter.$gte = new Date(from);
  if (to) dateFilter.$lte = new Date(to);

  const vehicles = await Vehicle.find({ status: { $ne: 'Retired' } });
  const results = [];

  for (const vehicle of vehicles) {
    const [fuelCost, maintenanceCost, trips, otherExpenses] = await Promise.all([
      FuelLog.aggregate([
        { $match: { vehicle: vehicle._id, ...(from || to ? { date: dateFilter } : {}) } },
        { $group: { _id: null, total: { $sum: '$cost' } } },
      ]),
      Maintenance.aggregate([
        { $match: { vehicle: vehicle._id, status: 'Closed' } },
        { $group: { _id: null, total: { $sum: '$cost' } } },
      ]),
      Trip.find({ vehicle: vehicle._id, status: 'Completed', ...(from || to ? { dispatchDate: dateFilter } : {}) }),
      Expense.aggregate([
        { $match: { vehicle: vehicle._id, ...(from || to ? { date: dateFilter } : {}) } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const totalRevenue = trips.reduce((s, t) => s + (t.revenue || 0), 0);
    const roi = calculateROI({
      acquisitionCost: vehicle.acquisitionCost || 1,
      totalFuelCost: fuelCost[0]?.total || 0,
      totalMaintenanceCost: maintenanceCost[0]?.total || 0,
      totalTripRevenue: totalRevenue,
      totalExpenses: otherExpenses[0]?.total || 0,
    });

    results.push({
      registrationNumber: vehicle.registrationNumber,
      vehicleName: vehicle.vehicleName,
      ...roi,
      totalTrips: trips.length,
    });
  }

  return results.sort((a, b) => b.roi - a.roi);
};

/**
 * Generate Monthly Summary Report
 */
const generateMonthlyReport = async (year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const [trips, fuelLogs, expenses, maintenance] = await Promise.all([
    Trip.find({ createdAt: { $gte: startDate, $lte: endDate } }),
    FuelLog.find({ date: { $gte: startDate, $lte: endDate } }),
    Expense.find({ date: { $gte: startDate, $lte: endDate } }),
    Maintenance.find({ openedAt: { $gte: startDate, $lte: endDate } }),
  ]);

  return {
    period: { year, month, startDate, endDate },
    trips: {
      total: trips.length,
      completed: trips.filter((t) => t.status === 'Completed').length,
      cancelled: trips.filter((t) => t.status === 'Cancelled').length,
      totalRevenue: trips.reduce((s, t) => s + (t.revenue || 0), 0),
      totalDistance: trips.reduce((s, t) => s + (t.actualDistance || 0), 0),
    },
    fuel: {
      totalLiters: fuelLogs.reduce((s, f) => s + f.liters, 0),
      totalCost: fuelLogs.reduce((s, f) => s + f.cost, 0),
    },
    expenses: {
      total: expenses.reduce((s, e) => s + e.amount, 0),
      count: expenses.length,
    },
    maintenance: {
      opened: maintenance.length,
      closed: maintenance.filter((m) => m.status === 'Closed').length,
      totalCost: maintenance.reduce((s, m) => s + m.cost, 0),
    },
  };
};

/**
 * Export data to CSV string
 */
const exportToCSV = (data, fields) => {
  try {
    const parser = new Parser({ fields });
    return parser.parse(data);
  } catch (err) {
    throw new Error('CSV export failed: ' + err.message);
  }
};

/**
 * Export data to PDF buffer
 */
const exportToPDF = (title, data, columns) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fillColor('#2563EB').fontSize(22).text('TransitOps', 40, 40);
      doc.fillColor('#1E293B').fontSize(14).text(title, 40, 70);
      doc.fillColor('#64748B').fontSize(10).text(`Generated: ${new Date().toLocaleString('en-IN')}`, 40, 90);
      doc.moveTo(40, 110).lineTo(550, 110).strokeColor('#E2E8F0').stroke();

      // Table header
      let y = 125;
      const colWidth = Math.floor(510 / columns.length);

      doc.fillColor('#F1F5F9').rect(40, y, 510, 20).fill();
      doc.fillColor('#475569').fontSize(9).font('Helvetica-Bold');
      columns.forEach((col, i) => {
        doc.text(col.label, 42 + i * colWidth, y + 5, { width: colWidth - 4, ellipsis: true });
      });

      y += 22;
      doc.font('Helvetica').fontSize(8).fillColor('#1E293B');

      // Table rows
      for (const row of data) {
        if (y > 750) {
          doc.addPage();
          y = 40;
        }
        if (data.indexOf(row) % 2 === 0) {
          doc.fillColor('#F8FAFC').rect(40, y, 510, 18).fill();
        }
        doc.fillColor('#1E293B');
        columns.forEach((col, i) => {
          const val = col.accessor ? col.accessor(row) : (row[col.key] ?? '—');
          doc.text(String(val), 42 + i * colWidth, y + 4, { width: colWidth - 4, ellipsis: true });
        });
        y += 20;
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  generateFleetUtilizationReport,
  generateFuelEfficiencyReport,
  generateOperationalCostReport,
  generateVehicleROIReport,
  generateMonthlyReport,
  exportToCSV,
  exportToPDF,
};
