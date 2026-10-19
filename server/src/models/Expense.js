const mongoose = require('mongoose');

const EXPENSE_CATEGORIES = ['Fuel', 'Maintenance', 'Toll', 'Repair', 'Insurance', 'Tyre', 'Permit', 'Driver Salary', 'Miscellaneous'];
const EXPENSE_STATUSES = ['Pending', 'Approved', 'Rejected'];

const expenseSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      default: null,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      default: null,
    },
    category: {
      type: String,
      required: [true, 'Expense category is required'],
      enum: { values: EXPENSE_CATEGORIES, message: `Category must be one of: ${EXPENSE_CATEGORIES.join(', ')}` },
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Expense date is required'],
      default: Date.now,
    },
    status: {
      type: String,
      enum: { values: EXPENSE_STATUSES, message: `Status must be one of: ${EXPENSE_STATUSES.join(', ')}` },
      default: 'Pending',
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    receiptPath: { type: String },
    loggedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

expenseSchema.index({ vehicle: 1, date: -1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ date: -1 });
expenseSchema.index({ status: 1 });

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
