const Driver = require('../models/Driver');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination, buildPaginationMeta, getSort } = require('../utils/queryHelpers');

/**
 * GET /api/drivers
 */
const getAllDrivers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, ['name', 'status', 'safetyScore', 'licenseExpiry', 'createdAt', 'totalTrips']);

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.licenseCategory) filter.licenseCategory = req.query.licenseCategory;
    if (req.query.search) {
      const re = new RegExp(req.query.search, 'i');
      filter.$or = [{ name: re }, { licenseNumber: re }, { phone: re }, { address: re }];
    }
    // Filter by expiry (expiring within N days)
    if (req.query.expiringIn) {
      const days = parseInt(req.query.expiringIn);
      filter.licenseExpiry = { $lte: new Date(Date.now() + days * 24 * 60 * 60 * 1000) };
    }

    const [drivers, total] = await Promise.all([
      Driver.find(filter).sort(sort).skip(skip).limit(limit),
      Driver.countDocuments(filter),
    ]);

    return new ApiResponse(200, 'Drivers fetched', drivers, buildPaginationMeta(total, page, limit)).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/drivers/:id
 */
const getDriverById = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return next(new ApiError(404, 'Driver not found'));
    return new ApiResponse(200, 'Driver fetched', driver).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/drivers
 */
const createDriver = async (req, res, next) => {
  try {
    const driver = await Driver.create(req.body);
    return new ApiResponse(201, 'Driver created successfully', driver).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/drivers/:id
 */
const updateDriver = async (req, res, next) => {
  try {
    if (req.body.status === 'On Trip') {
      return next(new ApiError(400, 'Status "On Trip" is managed automatically during trips.'));
    }

    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!driver) return next(new ApiError(404, 'Driver not found'));
    return new ApiResponse(200, 'Driver updated', driver).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/drivers/:id
 */
const deleteDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return next(new ApiError(404, 'Driver not found'));

    if (driver.status === 'On Trip') {
      return next(new ApiError(400, 'Cannot delete a driver who is currently on a trip.'));
    }

    await driver.deleteOne();
    return new ApiResponse(200, 'Driver deleted successfully').send(res);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllDrivers, getDriverById, createDriver, updateDriver, deleteDriver };
