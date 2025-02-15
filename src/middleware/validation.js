const { body, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

/**
 * User Validation Rules
 *
 * Defines validation and sanitization rules for user data
 */

// Common validation patterns
const NAME_PATTERN = /^[a-zA-Z\s-']+$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/;

// Email validation and sanitization rules
const emailValidation = body('email')
  .isEmail()
  .withMessage('Please provide a valid email')
  .normalizeEmail({
    gmail_remove_dots: false,
    gmail_remove_subaddress: false,
  })
  .trim()
  .toLowerCase();

// Password validation rules
const passwordValidation = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(PASSWORD_PATTERN)
  .withMessage(
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

// Name validation rules
const createNameValidation = (fieldName) =>
  body(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} is required`)
    .trim()
    .escape()
    .isLength({ max: 50 })
    .withMessage(`${fieldName} cannot exceed 50 characters`)
    .matches(NAME_PATTERN)
    .withMessage(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);

/**
 * Validation rule sets for different operations
 */
const userValidationRules = [
  emailValidation,
  passwordValidation,
  createNameValidation('firstName'),
  createNameValidation('lastName'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role specified').trim(),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
    .toBoolean(),
];

const userUpdateValidationRules = [
  emailValidation.optional(),
  passwordValidation.optional(),
  createNameValidation('firstName').optional(),
  createNameValidation('lastName').optional(),
  body('role').not().exists().withMessage('Role cannot be updated through this endpoint'),
  body('isActive').not().exists().withMessage('isActive cannot be updated through this endpoint'),
];

/**
 * Validation result handler
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    return next(new AppError(errorMessages[0], 400));
  }
  next();
};

/**
 * Request body sanitizer
 * Removes any fields that aren't explicitly allowed
 */
const sanitizeBody = (allowedFields) => {
  return (req, res, next) => {
    if (!req.body) return next();

    const sanitizedBody = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        sanitizedBody[key] = req.body[key];
      }
    });
    req.body = sanitizedBody;
    next();
  };
};

// Allowed fields for different operations
const createUserFields = ['email', 'password', 'firstName', 'lastName', 'role', 'isActive'];
const updateUserFields = ['email', 'password', 'firstName', 'lastName'];

// Export validation chains
module.exports = {
  validateUser: [sanitizeBody(createUserFields), ...userValidationRules, validate],
  validateUserUpdate: [sanitizeBody(updateUserFields), ...userUpdateValidationRules, validate],
};
