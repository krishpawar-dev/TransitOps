const mongoose = require('mongoose');

const MAINTENANCE_STATUSES = ['Open', 'In Progress', 'Closed'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const maintenanceSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle is required'],
    },
    title: {
      type: String,
      required: [true, 'Maintenance title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    cost: {
      type: Number,
      default: 0,
      min: [0, 'Cost cannot be negative'],
    },
    priority: {
      type: String,
      enum: { values: PRIORITIES, message: `Priority must be one of: ${PRIORITIES.join(', ')}` },
      default: 'Medium',
    },
    status: {
      type: String,
      enum: { values: MAINTENANCE_STATUSES, message: `Status must be one of: ${MAINTENANCE_STATUSES.join(', ')}` },
      default: 'Open',
    },
    technician: { type: String, trim: true },
    serviceCenter: { type: String, trim: true },
    openedAt: { type: Date, default: Date.now },
    closedAt: { type: Date, default: null },
    scheduledDate: Date,
    parts: [
      {
        name: String,
        quantity: Number,
        unitCost: Number,
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: days open
maintenanceSchema.virtual('daysOpen').get(function () {
  const end = this.closedAt || new Date();
  return Math.ceil((end - this.openedAt) / (1000 * 60 * 60 * 24));
});

maintenanceSchema.index({ vehicle: 1 });
maintenanceSchema.index({ status: 1 });
maintenanceSchema.index({ openedAt: -1 });

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
module.exports = Maintenance;
