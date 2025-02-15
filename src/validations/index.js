const { createValidationChain } = require('./validator');
const {
  userValidationRules,
  userUpdateValidationRules,
  createUserFields,
  updateUserFields,
} = require('./rules/user.rules');

/**
 * User Validation Chains
 */
exports.validateUser = createValidationChain(userValidationRules, createUserFields);
exports.validateUserUpdate = createValidationChain(userUpdateValidationRules, updateUserFields);

// Export other validation chains as they're added
