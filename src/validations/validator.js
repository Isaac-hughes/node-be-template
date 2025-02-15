const { validationResult } = require('express-validator');
const { AppError } = require('../middleware/errorHandler');

/**
 * Validates the request and handles validation errors
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    return next(new AppError(errorMessages[0], 400));
  }
  next();
};

/**
 * Creates a validation chain with sanitization
 * @param {Array} validationRules - Array of validation rules
 * @param {Array} allowedFields - Array of allowed fields
 */
exports.createValidationChain = (validationRules, allowedFields) => {
  return [
    // Sanitize body first
    (req, res, next) => {
      if (!req.body) return next();

      const sanitizedBody = {};
      Object.keys(req.body).forEach((key) => {
        if (allowedFields.includes(key)) {
          sanitizedBody[key] = req.body[key];
        }
      });
      req.body = sanitizedBody;
      next();
    },
    // Apply validation rules
    ...validationRules,
    // Validate results
    exports.validate,
  ];
};
