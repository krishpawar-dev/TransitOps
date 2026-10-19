const { validationResult } = require('express-validator');

/**
 * Run express-validator checks and return 422 if any fail.
 * Must be used AFTER the validator chains in the route.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({
        field: e.path || e.param,
        message: e.msg,
      })),
    });
  }
  next();
};

module.exports = { validate };
