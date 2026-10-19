const { body } = require('express-validator');

const vehicleValidators = [
  body('registrationNumber').trim().notEmpty().withMessage('Registration number is required').toUpperCase(),
  body('vehicleName').trim().notEmpty().withMessage('Vehicle name is required'),
  body('vehicleType').isIn(['Mini Truck', 'Light Truck', 'Medium Truck', 'Heavy Truck', 'Pickup', 'Van', 'Truck', 'Trailer'])
    .withMessage('Invalid vehicle type'),
  body('maxLoadCapacity').isFloat({ min: 0 }).withMessage('Max load capacity must be a non-negative number'),
  body('acquisitionCost').optional().isFloat({ min: 0 }).withMessage('Acquisition cost must be a non-negative number'),
  body('odometer').optional().isFloat({ min: 0 }).withMessage('Odometer must be a non-negative number'),
  body('status').optional().isIn(['Available', 'On Trip', 'In Shop', 'Retired']).withMessage('Invalid status'),
  body('fuelType').optional().isIn(['Diesel', 'Petrol', 'CNG', 'Electric']).withMessage('Invalid fuel type'),
];

const vehicleUpdateValidators = [
  body('vehicleName').optional().trim().notEmpty().withMessage('Vehicle name cannot be empty'),
  body('vehicleType').optional().isIn(['Mini Truck', 'Light Truck', 'Medium Truck', 'Heavy Truck', 'Pickup', 'Van', 'Truck', 'Trailer'])
    .withMessage('Invalid vehicle type'),
  body('maxLoadCapacity').optional().isFloat({ min: 0 }).withMessage('Max load capacity must be non-negative'),
  body('status').optional().isIn(['Available', 'On Trip', 'In Shop', 'Retired']).withMessage('Invalid status'),
];

module.exports = { vehicleValidators, vehicleUpdateValidators };
