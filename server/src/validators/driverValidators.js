const { body } = require('express-validator');

const driverValidators = [
  body('name').trim().notEmpty().withMessage('Driver name is required'),
  body('licenseNumber').trim().notEmpty().withMessage('License number is required').toUpperCase(),
  body('licenseCategory').isIn(['LMV', 'HMV', 'HTV', 'Transport']).withMessage('Invalid license category'),
  body('licenseExpiry').isISO8601().withMessage('Valid license expiry date is required').toDate(),
  body('phone').trim().notEmpty().withMessage('Phone number is required')
    .matches(/^\+?[\d\s-]{10,15}$/).withMessage('Invalid phone number format'),
  body('email').optional().isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('safetyScore').optional().isInt({ min: 0, max: 100 }).withMessage('Safety score must be 0–100'),
  body('status').optional().isIn(['Available', 'On Trip', 'Leave', 'Suspended']).withMessage('Invalid status'),
];

const driverUpdateValidators = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('licenseCategory').optional().isIn(['LMV', 'HMV', 'HTV', 'Transport']).withMessage('Invalid license category'),
  body('licenseExpiry').optional().isISO8601().withMessage('Valid license expiry date is required').toDate(),
  body('safetyScore').optional().isInt({ min: 0, max: 100 }).withMessage('Safety score must be 0–100'),
  body('status').optional().isIn(['Available', 'On Trip', 'Leave', 'Suspended']).withMessage('Invalid status'),
];

module.exports = { driverValidators, driverUpdateValidators };
