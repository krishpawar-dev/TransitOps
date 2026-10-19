const { body } = require('express-validator');

const fuelLogValidators = [
  body('vehicle').isMongoId().withMessage('Valid vehicle ID is required'),
  body('liters').isFloat({ min: 0.1 }).withMessage('Liters must be greater than 0'),
  body('cost').isFloat({ min: 0 }).withMessage('Cost must be non-negative'),
  body('date').optional().isISO8601().withMessage('Invalid date format').toDate(),
  body('odometer').optional().isFloat({ min: 0 }).withMessage('Odometer must be non-negative'),
  body('distanceSinceLastFill').optional().isFloat({ min: 0 }).withMessage('Distance must be non-negative'),
];

const expenseValidators = [
  body('category').isIn(['Fuel', 'Maintenance', 'Toll', 'Repair', 'Insurance', 'Tyre', 'Permit', 'Driver Salary', 'Miscellaneous'])
    .withMessage('Invalid expense category'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('date').optional().isISO8601().withMessage('Invalid date format').toDate(),
  body('vehicle').optional().isMongoId().withMessage('Invalid vehicle ID'),
  body('description').optional().trim().isLength({ max: 500 }),
];

module.exports = { fuelLogValidators, expenseValidators };
