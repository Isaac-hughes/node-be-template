const { createValidationChain } = require('./validator');
const {
  userValidationRules,
  userUpdateValidationRules,
  createUserFields,
  updateUserFields,
  profilePictureValidationRules,
} = require('./rules/user.rules');
const { loginValidationRules, loginFields } = require('./rules/auth.rules');

/**
 * User Validation Chains
 */
exports.validateUser = createValidationChain(userValidationRules, createUserFields);
exports.validateUserUpdate = createValidationChain(userUpdateValidationRules, updateUserFields);
exports.validateProfilePicture = createValidationChain(profilePictureValidationRules);

/**
 * Auth Validation Chains
 */
exports.validateLogin = createValidationChain(loginValidationRules, loginFields);
