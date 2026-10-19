const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const Maintenance = require('../models/Maintenance');
const FuelLog = require('../models/FuelLog');
const Expense = require('../models/Expense');
const ApiResponse = require('../utils/ApiResponse');
const { calculateFleetUtilization } = require('../utils/calculateROI');

/**
 * GET /api/dashboard — Single aggregated endpoint for the dashboard
 */
const getDashboard = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Run all queries in parallel for performance
    const [
      totalVehicles,
      availableVehicles,
      onTripVehicles,
      inShopVehicles,
      retiredVehicles,
      activeTrips,
      scheduledTrips,
      completedTrips,
      cancelledTrips,
      totalDrivers,
      driversOnDuty,
      availableDrivers,
      monthlyFuelAgg,
      monthlyExpenseAgg,
      recentTrips,
      recentMaintenance,
      monthlyTripCounts,
      expenseByCategory,
    ] = await Promise.all([
      Vehicle.countDocuments(),
      Vehicle.countDocuments({ status: 'Available' }),
      Vehicle.countDocuments({ status: 'On Trip' }),
      Vehicle.countDocuments({ status: 'In Shop' }),
      Vehicle.countDocuments({ status: 'Retired' }),
      Trip.countDocuments({ status: 'In Transit' }),
      Trip.countDocuments({ status: 'Scheduled' }),
      Trip.countDocuments({ status: 'Completed' }),
      Trip.countDocuments({ status: 'Cancelled' }),
      Driver.countDocuments(),
      Driver.countDocuments({ status: 'On Trip' }),
      Driver.countDocuments({ status: 'Available' }),
      // Monthly fuel cost
      FuelLog.aggregate([
        { $match: { date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: null, total: { $sum: '$cost' }, liters: { $sum: '$liters' } } },
      ]),
      // Monthly expenses
      Expense.aggregate([
        { $match: { date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      // Recent trips
      Trip.find().sort({ createdAt: -1 }).limit(5)
        .populate('vehicle', 'registrationNumber vehicleName')
        .populate('driver', 'name')
        .select('tripId source destination status dispatchDate'),
      // Recent maintenance
      Maintenance.find().sort({ createdAt: -1 }).limit(5)
        .populate('vehicle', 'registrationNumber vehicleName')
        .select('title status priority openedAt cost'),
      // Last 6 months trip counts for chart
      Trip.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            total: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
            cancelled: { $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] } },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      // Expenses by category for pie chart
      Expense.aggregate([
        { $match: { date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } },
      ]),
    ]);

    const fleetUtilization = calculateFleetUtilization(availableVehicles + onTripVehicles, totalVehicles);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTripChart = monthlyTripCounts.map((m) => ({
      month: monthNames[m._id.month - 1],
      year: m._id.year,
      total: m.total,
      completed: m.completed,
      cancelled: m.cancelled,
    }));

    return new ApiResponse(200, 'Dashboard data fetched', {
      vehicles: {
        total: totalVehicles,
        available: availableVehicles,
        onTrip: onTripVehicles,
        inShop: inShopVehicles,
        retired: retiredVehicles,
        utilization: fleetUtilization,
      },
      trips: {
        active: activeTrips,
        scheduled: scheduledTrips,
        completed: completedTrips,
        cancelled: cancelledTrips,
        total: activeTrips + scheduledTrips + completedTrips + cancelledTrips,
      },
      drivers: {
        total: totalDrivers,
        onDuty: driversOnDuty,
        available: availableDrivers,
      },
      monthly: {
        fuelCost: monthlyFuelAgg[0]?.total || 0,
        fuelLiters: monthlyFuelAgg[0]?.liters || 0,
        expenses: monthlyExpenseAgg[0]?.total || 0,
      },
      charts: {
        monthlyTrips: monthlyTripChart,
        expenseByCategory: expenseByCategory.map((e) => ({ category: e._id, amount: e.total })),
      },
      recent: {
        trips: recentTrips,
        maintenance: recentMaintenance,
      },
    }).send(res);
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };
