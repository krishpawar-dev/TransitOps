const mongoose = require('mongoose');

const DRIVER_STATUSES = ['Available', 'On Trip', 'Leave', 'Suspended'];
const LICENSE_CATEGORIES = ['LMV', 'HMV', 'HTV', 'Transport'];

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Driver name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    licenseCategory: {
      type: String,
      enum: { values: LICENSE_CATEGORIES, message: `License category must be one of: ${LICENSE_CATEGORIES.join(', ')}` },
      required: [true, 'License category is required'],
    },
    licenseExpiry: {
      type: Date,
      required: [true, 'License expiry date is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\+?[\d\s-]{10,15}$/, 'Invalid phone number'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    safetyScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 80,
    },
    status: {
      type: String,
      enum: { values: DRIVER_STATUSES, message: `Status must be one of: ${DRIVER_STATUSES.join(', ')}` },
      default: 'Available',
    },
    totalTrips: { type: Number, default: 0, min: 0 },
    totalDistance: { type: Number, default: 0, min: 0 },
    experience: { type: String, trim: true },
    address: { type: String, trim: true },
    emergencyContact: {
      name: String,
      phone: String,
    },
    licenseExpiryReminderSent: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes (unique: true already indexes licenseNumber)
driverSchema.index({ status: 1 });
driverSchema.index({ licenseExpiry: 1 });

driverSchema.virtual('isLicenseExpired').get(function () {
  return this.licenseExpiry < new Date();
});

driverSchema.virtual('isDispatchable').get(function () {
  return (
    this.status === 'Available' &&
    this.licenseExpiry >= new Date()
  );
});

const Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;
