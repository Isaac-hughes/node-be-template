/**
 * Common sanitization functions and middleware
 */

/**
 * Strips unexpected fields from request body
 * @param {Array} allowedFields - List of fields to allow
 */
exports.sanitizeBody = (allowedFields) => {
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

// Add more sanitizers as needed
