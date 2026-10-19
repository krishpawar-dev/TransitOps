const mongoose = require('mongoose');

const fuelLogSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle is required'],
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      default: null,
    },
    liters: {
      type: Number,
      required: [true, 'Fuel quantity (liters) is required'],
      min: [0.1, 'Liters must be greater than 0'],
    },
    cost: {
      type: Number,
      required: [true, 'Fuel cost is required'],
      min: [0, 'Cost cannot be negative'],
    },
    pricePerLiter: {
      type: Number,
      min: 0,
    },
    odometer: {
      type: Number,
      min: 0,
    },
    distanceSinceLastFill: {
      type: Number,
      min: 0,
      default: 0,
    },
    fuelStation: { type: String, trim: true },
    date: {
      type: Date,
      required: [true, 'Fuel date is required'],
      default: Date.now,
    },
    loggedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String, maxlength: 300 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-calculate price per liter before save (Mongoose async middleware)
fuelLogSchema.pre('save', async function () {
  if (this.liters && this.cost && !this.pricePerLiter) {
    this.pricePerLiter = parseFloat((this.cost / this.liters).toFixed(2));
  }
});

// Virtual: km per liter
fuelLogSchema.virtual('kmPerLiter').get(function () {
  if (this.distanceSinceLastFill && this.liters) {
    return parseFloat((this.distanceSinceLastFill / this.liters).toFixed(2));
  }
  return null;
});

fuelLogSchema.index({ vehicle: 1, date: -1 });
fuelLogSchema.index({ date: -1 });

const FuelLog = mongoose.model('FuelLog', fuelLogSchema);
module.exports = FuelLog;
