const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Vehicle = require('../models/Vehicle');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination, buildPaginationMeta, getSort, getDateRangeFilter } = require('../utils/queryHelpers');

/* ─── Multer config for document uploads ──────────────────── */
const uploadDir = path.join(__dirname, '../../uploads/documents');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new ApiError(400, 'Only PDF and image files are allowed'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single('document');

/* ─── Controllers ──────────────────────────────────────────── */

/**
 * GET /api/vehicles
 */
const getAllVehicles = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, ['registrationNumber', 'vehicleName', 'status', 'createdAt', 'odometer']);

    // Build filter
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.vehicleType) filter.vehicleType = req.query.vehicleType;
    if (req.query.region) filter.region = new RegExp(req.query.region, 'i');
    if (req.query.search) {
      const re = new RegExp(req.query.search, 'i');
      filter.$or = [{ registrationNumber: re }, { vehicleName: re }, { model: re }, { vehicleType: re }];
    }

    const [vehicles, total] = await Promise.all([
      Vehicle.find(filter).sort(sort).skip(skip).limit(limit).populate('currentDriver', 'name phone'),
      Vehicle.countDocuments(filter),
    ]);

    return new ApiResponse(200, 'Vehicles fetched', vehicles, buildPaginationMeta(total, page, limit)).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/vehicles/:id
 */
const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('currentDriver', 'name phone status');
    if (!vehicle) return next(new ApiError(404, 'Vehicle not found'));
    return new ApiResponse(200, 'Vehicle fetched', vehicle).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/vehicles
 */
const createVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    return new ApiResponse(201, 'Vehicle created successfully', vehicle).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/vehicles/:id
 */
const updateVehicle = async (req, res, next) => {
  try {
    // Prevent changing status to On Trip directly
    if (req.body.status === 'On Trip') {
      return next(new ApiError(400, 'Status "On Trip" is set automatically during trip dispatch.'));
    }

    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!vehicle) return next(new ApiError(404, 'Vehicle not found'));
    return new ApiResponse(200, 'Vehicle updated', vehicle).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/vehicles/:id
 */
const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return next(new ApiError(404, 'Vehicle not found'));

    if (vehicle.status === 'On Trip') {
      return next(new ApiError(400, 'Cannot delete a vehicle that is currently on a trip.'));
    }

    await vehicle.deleteOne();
    return new ApiResponse(200, 'Vehicle deleted successfully').send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/vehicles/:id/documents
 */
const uploadDocument = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) return next(err instanceof Error ? err : new ApiError(400, err.message));

    try {
      if (!req.file) return next(new ApiError(400, 'No file uploaded'));

      const vehicle = await Vehicle.findById(req.params.id);
      if (!vehicle) return next(new ApiError(404, 'Vehicle not found'));

      vehicle.documents.push({
        name: req.body.name || req.file.originalname,
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
      });

      await vehicle.save();
      return new ApiResponse(200, 'Document uploaded', vehicle.documents).send(res);
    } catch (e) {
      next(e);
    }
  });
};

/**
 * DELETE /api/vehicles/:id/documents/:docId
 */
const deleteDocument = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return next(new ApiError(404, 'Vehicle not found'));

    const doc = vehicle.documents.id(req.params.docId);
    if (!doc) return next(new ApiError(404, 'Document not found'));

    // Delete file from disk
    if (doc.path && fs.existsSync(doc.path)) {
      fs.unlinkSync(doc.path);
    }

    vehicle.documents.pull(req.params.docId);
    await vehicle.save();

    return new ApiResponse(200, 'Document deleted').send(res);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle, uploadDocument, deleteDocument };
