/**
 * Common validation patterns used across the application
 */

exports.PATTERNS = {
  // Name allows letters, spaces, hyphens, and apostrophes
  NAME: /^[a-zA-Z\s-']+$/,

  // Password requires uppercase, lowercase, number, and special character
  PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/,

  // Add more patterns as needed
};

// Add pattern descriptions for documentation
exports.PATTERN_DESCRIPTIONS = {
  NAME: 'Can only contain letters, spaces, hyphens, and apostrophes',
  PASSWORD:
    'Must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
};
