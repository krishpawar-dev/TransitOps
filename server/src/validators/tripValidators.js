const { body } = require('express-validator');

const tripValidators = [
  body('source').trim().notEmpty().withMessage('Source is required'),
  body('destination').trim().notEmpty().withMessage('Destination is required'),
  body('vehicle').isMongoId().withMessage('Valid vehicle ID is required'),
  body('driver').isMongoId().withMessage('Valid driver ID is required'),
  body('cargoWeight').isFloat({ min: 0 }).withMessage('Cargo weight must be a non-negative number'),
  body('plannedDistance').optional().isFloat({ min: 0 }).withMessage('Planned distance must be non-negative'),
  body('revenue').optional().isFloat({ min: 0 }).withMessage('Revenue must be non-negative'),
];

const dispatchValidators = [
  body('dispatchDate').optional().isISO8601().withMessage('Invalid dispatch date').toDate(),
];

const completeValidators = [
  body('actualDistance').isFloat({ min: 0 }).withMessage('Actual distance is required'),
  body('fuelConsumed').optional().isFloat({ min: 0 }).withMessage('Fuel consumed must be non-negative'),
  body('fuelCost').optional().isFloat({ min: 0 }).withMessage('Fuel cost must be non-negative'),
  body('tollCharges').optional().isFloat({ min: 0 }).withMessage('Toll charges must be non-negative'),
];

const cancelValidators = [
  body('cancelReason').optional().trim().isLength({ max: 500 }).withMessage('Cancel reason too long'),
];

module.exports = { tripValidators, dispatchValidators, completeValidators, cancelValidators };
