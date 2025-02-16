const { body } = require('express-validator');

// Reuse the same email and password validation logic
const emailValidation = body('email')
  .isEmail()
  .withMessage('Please provide a valid email')
  .normalizeEmail({
    gmail_remove_dots: false,
    gmail_remove_subaddress: false,
  })
  .trim()
  .toLowerCase();

const passwordValidation = body('password').notEmpty().withMessage('Password is required');

// Login validation rules
exports.loginValidationRules = [emailValidation, passwordValidation];

// Define allowed fields
exports.loginFields = ['email', 'password'];
