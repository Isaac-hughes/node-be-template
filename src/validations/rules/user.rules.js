const { body } = require('express-validator');
const { PATTERNS, PATTERN_DESCRIPTIONS } = require('../patterns');

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
  .matches(PATTERNS.PASSWORD)
  .withMessage(PATTERN_DESCRIPTIONS.PASSWORD);

// Name validation rules
const createNameValidation = (fieldName) =>
  body(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} is required`)
    .trim()
    .escape()
    .isLength({ max: 50 })
    .withMessage(`${fieldName} cannot exceed 50 characters`)
    .matches(PATTERNS.NAME)
    .withMessage(`${fieldName} ${PATTERN_DESCRIPTIONS.NAME}`);

// Create validation rule sets
exports.userValidationRules = [
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

exports.userUpdateValidationRules = [
  emailValidation.optional(),
  passwordValidation.optional(),
  createNameValidation('firstName').optional(),
  createNameValidation('lastName').optional(),
  body('role').not().exists().withMessage('Role cannot be updated through this endpoint'),
  body('isActive').not().exists().withMessage('isActive cannot be updated through this endpoint'),
];

// Define allowed fields
exports.createUserFields = ['email', 'password', 'firstName', 'lastName', 'role', 'isActive'];
exports.updateUserFields = ['email', 'password', 'firstName', 'lastName'];
