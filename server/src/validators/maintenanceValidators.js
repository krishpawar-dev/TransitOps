const { body } = require('express-validator');

const maintenanceValidators = [
  body('vehicle').isMongoId().withMessage('Valid vehicle ID is required'),
  body('title').trim().notEmpty().withMessage('Maintenance title is required').isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be non-negative'),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid priority'),
  body('scheduledDate').optional().isISO8601().withMessage('Invalid scheduled date').toDate(),
];

const closeMaintenanceValidators = [
  body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be non-negative'),
  body('notes').optional().trim().isLength({ max: 500 }),
];

module.exports = { maintenanceValidators, closeMaintenanceValidators };
