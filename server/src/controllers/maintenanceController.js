const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination, buildPaginationMeta, getSort } = require('../utils/queryHelpers');

/**
 * GET /api/maintenance
 */
const getAllMaintenance = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, ['openedAt', 'closedAt', 'cost', 'priority', 'status', 'createdAt']);

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.vehicle) filter.vehicle = req.query.vehicle;
    if (req.query.search) {
      const re = new RegExp(req.query.search, 'i');
      filter.$or = [{ title: re }, { technician: re }, { serviceCenter: re }];
    }
    if (req.query.from || req.query.to) {
      filter.openedAt = {};
      if (req.query.from) filter.openedAt.$gte = new Date(req.query.from);
      if (req.query.to) filter.openedAt.$lte = new Date(req.query.to);
    }

    const [records, total] = await Promise.all([
      Maintenance.find(filter).sort(sort).skip(skip).limit(limit)
        .populate('vehicle', 'registrationNumber vehicleName')
        .populate('createdBy', 'name'),
      Maintenance.countDocuments(filter),
    ]);

    return new ApiResponse(200, 'Maintenance records fetched', records, buildPaginationMeta(total, page, limit)).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/maintenance/:id
 */
const getMaintenanceById = async (req, res, next) => {
  try {
    const record = await Maintenance.findById(req.params.id)
      .populate('vehicle', 'registrationNumber vehicleName status')
      .populate('createdBy', 'name');
    if (!record) return next(new ApiError(404, 'Maintenance record not found'));
    return new ApiResponse(200, 'Maintenance record fetched', record).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/maintenance — Open a new maintenance record
 * Business: Sets vehicle status → In Shop
 */
const createMaintenance = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.body.vehicle);
    if (!vehicle) return next(new ApiError(404, 'Vehicle not found'));

    if (vehicle.status === 'On Trip') {
      return next(new ApiError(400, 'Cannot open maintenance for a vehicle currently on a trip.'));
    }
    if (vehicle.status === 'Retired') {
      return next(new ApiError(400, 'Cannot open maintenance for a retired vehicle.'));
    }

    // Create record and set vehicle to In Shop atomically
    const [record] = await Promise.all([
      Maintenance.create({ ...req.body, createdBy: req.user._id, openedAt: new Date() }),
      Vehicle.findByIdAndUpdate(req.body.vehicle, { status: 'In Shop' }),
    ]);

    const populated = await record.populate('vehicle', 'registrationNumber vehicleName');
    return new ApiResponse(201, 'Maintenance opened. Vehicle set to In Shop.', populated).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/maintenance/:id — Update maintenance details
 */
const updateMaintenance = async (req, res, next) => {
  try {
    const record = await Maintenance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('vehicle', 'registrationNumber vehicleName');
    if (!record) return next(new ApiError(404, 'Maintenance record not found'));
    return new ApiResponse(200, 'Maintenance updated', record).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/maintenance/:id/close — Close maintenance
 * Business: Sets vehicle → Available (unless Retired)
 */
const closeMaintenance = async (req, res, next) => {
  try {
    const record = await Maintenance.findById(req.params.id);
    if (!record) return next(new ApiError(404, 'Maintenance record not found'));

    if (record.status === 'Closed') {
      return next(new ApiError(400, 'This maintenance record is already closed.'));
    }

    const vehicle = await Vehicle.findById(record.vehicle);

    // Close the maintenance record
    record.status = 'Closed';
    record.closedAt = new Date();
    if (req.body.cost !== undefined) record.cost = req.body.cost;
    if (req.body.notes) record.description = (record.description || '') + '\n[Close Note] ' + req.body.notes;
    await record.save();

    // Restore vehicle to Available unless it was retired
    if (vehicle && vehicle.status !== 'Retired') {
      vehicle.status = 'Available';
      await vehicle.save();
    }

    const populated = await record.populate('vehicle', 'registrationNumber vehicleName status');
    return new ApiResponse(200, 'Maintenance closed. Vehicle restored to Available.', populated).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/maintenance/:id
 */
const deleteMaintenance = async (req, res, next) => {
  try {
    const record = await Maintenance.findById(req.params.id);
    if (!record) return next(new ApiError(404, 'Maintenance record not found'));

    // If still open, restore vehicle status on delete
    if (record.status !== 'Closed') {
      await Vehicle.findByIdAndUpdate(record.vehicle, { status: 'Available' });
    }

    await record.deleteOne();
    return new ApiResponse(200, 'Maintenance record deleted').send(res);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllMaintenance, getMaintenanceById, createMaintenance, updateMaintenance, closeMaintenance, deleteMaintenance };
