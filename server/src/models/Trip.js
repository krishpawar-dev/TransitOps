const mongoose = require('mongoose');

const TRIP_STATUSES = ['Scheduled', 'In Transit', 'Completed', 'Cancelled'];

const tripSchema = new mongoose.Schema(
  {
    tripId: {
      type: String,
      unique: true,
    },
    source: {
      type: String,
      required: [true, 'Source is required'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle is required'],
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: [true, 'Driver is required'],
    },
    cargoWeight: {
      type: Number,
      required: [true, 'Cargo weight (tonnes) is required'],
      min: [0, 'Cargo weight cannot be negative'],
    },
    cargoDescription: { type: String, trim: true },
    plannedDistance: {
      type: Number,
      min: 0,
      default: 0,
    },
    actualDistance: { type: Number, min: 0, default: 0 },
    fuelConsumed: { type: Number, min: 0, default: 0 },
    fuelCost: { type: Number, min: 0, default: 0 },
    tollCharges: { type: Number, min: 0, default: 0 },
    revenue: { type: Number, min: 0, default: 0 },
    status: {
      type: String,
      enum: { values: TRIP_STATUSES, message: `Status must be one of: ${TRIP_STATUSES.join(', ')}` },
      default: 'Scheduled',
    },
    dispatchDate: { type: Date },
    completionDate: { type: Date },
    cancelledAt: { type: Date },
    cancelReason: { type: String, trim: true },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-generate unique Trip ID before save
tripSchema.pre('save', async function () {
  if (this.isNew && !this.tripId) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const timestamp = Date.now().toString().slice(-4);
    this.tripId = `TR-${timestamp}${randomSuffix}`;
  }
});

// Virtual: duration in minutes
tripSchema.virtual('durationMinutes').get(function () {
  if (this.dispatchDate && this.completionDate) {
    return Math.round((this.completionDate - this.dispatchDate) / 60000);
  }
  return null;
});

// Virtual: fuel efficiency
tripSchema.virtual('fuelEfficiency').get(function () {
  if (this.fuelConsumed && this.fuelConsumed > 0 && this.actualDistance) {
    return parseFloat((this.actualDistance / this.fuelConsumed).toFixed(2));
  }
  return null;
});

// Indexes
tripSchema.index({ status: 1 });
tripSchema.index({ vehicle: 1 });
tripSchema.index({ driver: 1 });
tripSchema.index({ dispatchDate: -1 });
tripSchema.index({ createdAt: -1 });

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;
