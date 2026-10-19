const FuelLog = require('../models/FuelLog');
const Vehicle = require('../models/Vehicle');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination, buildPaginationMeta, getSort } = require('../utils/queryHelpers');
const { calculateFuelEfficiency, calculateCostPerKm } = require('../utils/calculateROI');

/**
 * GET /api/fuel
 */
const getAllFuelLogs = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, ['date', 'liters', 'cost', 'createdAt']);

    const filter = {};
    if (req.query.vehicle) filter.vehicle = req.query.vehicle;
    if (req.query.from || req.query.to) {
      filter.date = {};
      if (req.query.from) filter.date.$gte = new Date(req.query.from);
      if (req.query.to) filter.date.$lte = new Date(req.query.to);
    }
    if (req.query.search) {
      const re = new RegExp(req.query.search, 'i');
      filter.$or = [{ fuelStation: re }];
    }

    const [logs, total] = await Promise.all([
      FuelLog.find(filter).sort(sort).skip(skip).limit(limit)
        .populate('vehicle', 'registrationNumber vehicleName')
        .populate('loggedBy', 'name'),
      FuelLog.countDocuments(filter),
    ]);

    // Aggregate totals
    const aggregation = await FuelLog.aggregate([
      { $match: filter },
      { $group: { _id: null, totalLiters: { $sum: '$liters' }, totalCost: { $sum: '$cost' }, totalDistance: { $sum: '$distanceSinceLastFill' } } },
    ]);

    const summary = aggregation[0] || { totalLiters: 0, totalCost: 0, totalDistance: 0 };
    summary.avgEfficiency = calculateFuelEfficiency(summary.totalDistance, summary.totalLiters);

    return new ApiResponse(200, 'Fuel logs fetched', { logs, summary }, buildPaginationMeta(total, page, limit)).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/fuel/:id
 */
const getFuelLogById = async (req, res, next) => {
  try {
    const log = await FuelLog.findById(req.params.id)
      .populate('vehicle', 'registrationNumber vehicleName odometer')
      .populate('loggedBy', 'name');
    if (!log) return next(new ApiError(404, 'Fuel log not found'));
    return new ApiResponse(200, 'Fuel log fetched', log).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/fuel
 */
const createFuelLog = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.body.vehicle);
    if (!vehicle) return next(new ApiError(404, 'Vehicle not found'));

    const log = await FuelLog.create({ ...req.body, loggedBy: req.user._id });
    const populated = await log.populate('vehicle', 'registrationNumber vehicleName');
    return new ApiResponse(201, 'Fuel log created', populated).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/fuel/:id
 */
const updateFuelLog = async (req, res, next) => {
  try {
    const log = await FuelLog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('vehicle', 'registrationNumber vehicleName');
    if (!log) return next(new ApiError(404, 'Fuel log not found'));
    return new ApiResponse(200, 'Fuel log updated', log).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/fuel/:id
 */
const deleteFuelLog = async (req, res, next) => {
  try {
    const log = await FuelLog.findByIdAndDelete(req.params.id);
    if (!log) return next(new ApiError(404, 'Fuel log not found'));
    return new ApiResponse(200, 'Fuel log deleted').send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/fuel/vehicle/:vehicleId/efficiency — Fuel efficiency per vehicle
 */
const getVehicleFuelEfficiency = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    if (!vehicle) return next(new ApiError(404, 'Vehicle not found'));

    const logs = await FuelLog.find({ vehicle: req.params.vehicleId }).sort({ date: -1 });
    const totalLiters = logs.reduce((s, l) => s + l.liters, 0);
    const totalCost = logs.reduce((s, l) => s + l.cost, 0);
    const totalDistance = logs.reduce((s, l) => s + (l.distanceSinceLastFill || 0), 0);

    return new ApiResponse(200, 'Fuel efficiency fetched', {
      vehicle: { registrationNumber: vehicle.registrationNumber, vehicleName: vehicle.vehicleName },
      totalLiters,
      totalCost,
      totalDistance,
      avgEfficiency: calculateFuelEfficiency(totalDistance, totalLiters),
      avgCostPerKm: calculateCostPerKm(totalCost, totalDistance),
      totalFills: logs.length,
    }).send(res);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllFuelLogs, getFuelLogById, createFuelLog, updateFuelLog, deleteFuelLog, getVehicleFuelEfficiency };
