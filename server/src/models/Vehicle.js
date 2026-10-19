const mongoose = require('mongoose');

const VEHICLE_TYPES = ['Mini Truck', 'Light Truck', 'Medium Truck', 'Heavy Truck', 'Pickup', 'Van', 'Truck', 'Trailer'];
const VEHICLE_STATUSES = ['Available', 'On Trip', 'In Shop', 'Retired'];

const documentSchema = new mongoose.Schema({
  name: String,
  filename: String,
  originalName: String,
  path: String,
  uploadedAt: { type: Date, default: Date.now },
}, { _id: true });

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9-]+$/, 'Invalid registration number format'],
    },
    vehicleName: {
      type: String,
      required: [true, 'Vehicle name is required'],
      trim: true,
    },
    model: { type: String, trim: true },
    vehicleType: {
      type: String,
      enum: { values: VEHICLE_TYPES, message: `Vehicle type must be one of: ${VEHICLE_TYPES.join(', ')}` },
      required: [true, 'Vehicle type is required'],
    },
    maxLoadCapacity: {
      type: Number,
      required: [true, 'Max load capacity (tonnes) is required'],
      min: [0, 'Capacity cannot be negative'],
    },
    fuelType: {
      type: String,
      enum: ['Diesel', 'Petrol', 'CNG', 'Electric'],
      default: 'Diesel',
    },
    odometer: { type: Number, default: 0, min: 0 },
    acquisitionCost: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: { values: VEHICLE_STATUSES, message: `Status must be one of: ${VEHICLE_STATUSES.join(', ')}` },
      default: 'Available',
    },
    currentDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null },
    documents: [documentSchema],
    notes: { type: String, maxlength: 500 },
    region: { type: String, trim: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes (unique: true already indexes registrationNumber)
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ vehicleType: 1 });
vehicleSchema.index({ region: 1 });

vehicleSchema.virtual('isDispatchable').get(function () {
  return this.status === 'Available';
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;
