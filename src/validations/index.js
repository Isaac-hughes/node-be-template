const { createValidationChain } = require('./validator');
const {
  userValidationRules,
  userUpdateValidationRules,
  createUserFields,
  updateUserFields,
  profilePictureValidationRules,
} = require('./rules/user.rules');

/**
 * User Validation Chains
 */
exports.validateUser = createValidationChain(userValidationRules, createUserFields);
exports.validateUserUpdate = createValidationChain(userUpdateValidationRules, updateUserFields);
exports.validateProfilePicture = createValidationChain(profilePictureValidationRules);
