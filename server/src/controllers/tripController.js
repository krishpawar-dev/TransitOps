const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination, buildPaginationMeta, getSort, getDateRangeFilter } = require('../utils/queryHelpers');

/* ─── Helpers ──────────────────────────────────────────────── */

/**
 * Validate dispatch eligibility and enforce all business rules.
 */
const validateDispatchEligibility = async (vehicleId, driverId, cargoWeight, excludeTripId = null) => {
  const [vehicle, driver] = await Promise.all([
    Vehicle.findById(vehicleId),
    Driver.findById(driverId),
  ]);

  if (!vehicle) throw new ApiError(404, 'Vehicle not found');
  if (!driver) throw new ApiError(404, 'Driver not found');

  // Vehicle rules
  if (vehicle.status === 'Retired') throw new ApiError(400, 'Retired vehicles cannot be dispatched.');
  if (vehicle.status === 'In Shop') throw new ApiError(400, 'Vehicle is under maintenance and cannot be dispatched.');
  if (vehicle.status === 'On Trip') throw new ApiError(400, 'Vehicle is already on an active trip.');

  // Driver rules
  if (driver.status === 'Suspended') throw new ApiError(400, 'Suspended drivers cannot be dispatched.');
  if (driver.status === 'On Trip') throw new ApiError(400, 'Driver is already on an active trip.');
  if (driver.status === 'Leave') throw new ApiError(400, 'Driver is on leave and cannot be dispatched.');
  if (driver.licenseExpiry < new Date()) throw new ApiError(400, `Driver's license has expired on ${driver.licenseExpiry.toLocaleDateString()}. Cannot dispatch.`);

  // Cargo weight check
  if (cargoWeight > vehicle.maxLoadCapacity) {
    throw new ApiError(400, `Cargo weight (${cargoWeight}T) exceeds vehicle's max load capacity (${vehicle.maxLoadCapacity}T).`);
  }

  return { vehicle, driver };
};

/* ─── Controllers ──────────────────────────────────────────── */

/**
 * GET /api/trips
 */
const getAllTrips = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, ['dispatchDate', 'completionDate', 'status', 'createdAt', 'cargoWeight']);

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const dateFilter = getDateRangeFilter('dispatchDate', req.query.from, req.query.to);
    Object.assign(filter, dateFilter);

    if (req.query.vehicle) filter.vehicle = req.query.vehicle;
    if (req.query.driver) filter.driver = req.query.driver;
    if (req.query.search) {
      const re = new RegExp(req.query.search, 'i');
      filter.$or = [{ source: re }, { destination: re }, { tripId: re }, { cargoDescription: re }];
    }

    const [trips, total] = await Promise.all([
      Trip.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('vehicle', 'registrationNumber vehicleName vehicleType')
        .populate('driver', 'name phone licenseNumber')
        .populate('createdBy', 'name'),
      Trip.countDocuments(filter),
    ]);

    return new ApiResponse(200, 'Trips fetched', trips, buildPaginationMeta(total, page, limit)).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/trips/:id
 */
const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('vehicle', 'registrationNumber vehicleName maxLoadCapacity')
      .populate('driver', 'name phone licenseNumber safetyScore')
      .populate('createdBy', 'name');
    if (!trip) return next(new ApiError(404, 'Trip not found'));
    return new ApiResponse(200, 'Trip fetched', trip).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/trips — Create a scheduled trip
 */
const createTrip = async (req, res, next) => {
  try {
    const { vehicle: vehicleId, driver: driverId, cargoWeight } = req.body;

    // Validate that vehicle and driver exist (basic check; dispatch rules enforced at dispatch time)
    const [vehicle, driver] = await Promise.all([
      Vehicle.findById(vehicleId),
      Driver.findById(driverId),
    ]);

    if (!vehicle) return next(new ApiError(404, 'Vehicle not found'));
    if (!driver) return next(new ApiError(404, 'Driver not found'));

    if (cargoWeight > vehicle.maxLoadCapacity) {
      return next(new ApiError(400, `Cargo weight (${cargoWeight}T) exceeds vehicle's max capacity (${vehicle.maxLoadCapacity}T).`));
    }

    const trip = await Trip.create({ ...req.body, createdBy: req.user._id });
    return new ApiResponse(201, 'Trip created successfully', trip).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/trips/:id — Update trip details (Scheduled only)
 */
const updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return next(new ApiError(404, 'Trip not found'));

    if (!['Scheduled'].includes(trip.status)) {
      return next(new ApiError(400, `Cannot edit a trip with status "${trip.status}".`));
    }

    const updated = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    return new ApiResponse(200, 'Trip updated', updated).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/trips/:id
 */
const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return next(new ApiError(404, 'Trip not found'));

    if (trip.status === 'In Transit') {
      return next(new ApiError(400, 'Cannot delete a trip that is In Transit.'));
    }

    await trip.deleteOne();
    return new ApiResponse(200, 'Trip deleted successfully').send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/trips/:id/dispatch — Dispatch a scheduled trip
 * Business: Validates all rules → Changes vehicle+driver to On Trip
 */
const dispatchTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return next(new ApiError(404, 'Trip not found'));
    if (trip.status !== 'Scheduled') {
      return next(new ApiError(400, `Trip cannot be dispatched. Current status: ${trip.status}`));
    }

    const { vehicle, driver } = await validateDispatchEligibility(trip.vehicle, trip.driver, trip.cargoWeight);

    // Atomic updates
    await Promise.all([
      Vehicle.findByIdAndUpdate(vehicle._id, { status: 'On Trip', currentDriver: driver._id }),
      Driver.findByIdAndUpdate(driver._id, { status: 'On Trip' }),
      Trip.findByIdAndUpdate(trip._id, {
        status: 'In Transit',
        dispatchDate: req.body.dispatchDate || new Date(),
      }),
    ]);

    const updatedTrip = await Trip.findById(trip._id)
      .populate('vehicle', 'registrationNumber vehicleName')
      .populate('driver', 'name phone');

    return new ApiResponse(200, 'Trip dispatched successfully', updatedTrip).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/trips/:id/complete — Complete an in-transit trip
 * Business: Restores vehicle → Available, driver → Available, saves stats
 */
const completeTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return next(new ApiError(404, 'Trip not found'));
    if (trip.status !== 'In Transit') {
      return next(new ApiError(400, `Trip cannot be completed. Current status: ${trip.status}`));
    }

    const { actualDistance, fuelConsumed = 0, fuelCost = 0, tollCharges = 0, revenue, notes } = req.body;

    // Update vehicle odometer
    const vehicle = await Vehicle.findById(trip.vehicle);
    if (vehicle) {
      vehicle.status = 'Available';
      vehicle.currentDriver = null;
      if (actualDistance) vehicle.odometer += actualDistance;
      await vehicle.save();
    }

    // Update driver stats
    const driver = await Driver.findById(trip.driver);
    if (driver) {
      driver.status = 'Available';
      driver.totalTrips = (driver.totalTrips || 0) + 1;
      driver.totalDistance = (driver.totalDistance || 0) + (actualDistance || 0);
      await driver.save();
    }

    // Finalize trip
    const updatedTrip = await Trip.findByIdAndUpdate(
      trip._id,
      {
        status: 'Completed',
        completionDate: new Date(),
        actualDistance: actualDistance || trip.plannedDistance,
        fuelConsumed,
        fuelCost,
        tollCharges,
        ...(revenue !== undefined && { revenue }),
        ...(notes && { notes }),
      },
      { new: true }
    )
      .populate('vehicle', 'registrationNumber vehicleName')
      .populate('driver', 'name phone');

    return new ApiResponse(200, 'Trip completed successfully', updatedTrip).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/trips/:id/cancel — Cancel a Scheduled or In Transit trip
 * Business: Restores statuses
 */
const cancelTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return next(new ApiError(404, 'Trip not found'));

    if (!['Scheduled', 'In Transit'].includes(trip.status)) {
      return next(new ApiError(400, `Trip cannot be cancelled. Current status: ${trip.status}`));
    }

    const updates = [];

    // Only restore if actually dispatched
    if (trip.status === 'In Transit') {
      updates.push(
        Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'Available', currentDriver: null }),
        Driver.findByIdAndUpdate(trip.driver, { status: 'Available' })
      );
    }

    updates.push(
      Trip.findByIdAndUpdate(trip._id, {
        status: 'Cancelled',
        cancelledAt: new Date(),
        cancelReason: req.body.cancelReason || '',
      })
    );

    await Promise.all(updates);

    const updatedTrip = await Trip.findById(trip._id)
      .populate('vehicle', 'registrationNumber vehicleName')
      .populate('driver', 'name');

    return new ApiResponse(200, 'Trip cancelled successfully', updatedTrip).send(res);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip, dispatchTrip, completeTrip, cancelTrip };
