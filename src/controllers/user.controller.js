const { AppError } = require('../middleware/errorHandler');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

/**
 * User Controller
 *
 * Handles all user-related business logic including:
 * - User CRUD operations
 * - Response formatting
 * - Error handling
 */

/**
 * Get all users from the database
 *
 * @route   GET /api/v1/users
 * @returns {Object} 200 - List of users with count
 */
exports.getUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

/**
 * Get a specific user by ID
 *
 * @route   GET /api/v1/users/:id
 * @param   {string} req.params.id - User ID
 * @returns {Object} 200 - User object
 * @throws  {AppError} 404 - User not found
 */
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

/**
 * Create a new user
 *
 * @route   POST /api/v1/users
 * @param   {Object} req.body - User data (validated by middleware)
 * @returns {Object} 201 - Created user object
 */
exports.createUser = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);

  // Remove password from output
  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    data: { user: newUser },
  });
});

/**
 * Update an existing user
 *
 * @route   PATCH /api/v1/users/:id
 * @param   {string} req.params.id - User ID
 * @param   {Object} req.body - Updated user data (validated by middleware)
 * @returns {Object} 200 - Updated user object
 * @throws  {AppError} 404 - User not found
 */
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return updated document
    runValidators: true, // Run model validators
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

/**
 * Delete a user
 *
 * @route   DELETE /api/v1/users/:id
 * @param   {string} req.params.id - User ID
 * @returns {null} 204 - No content
 * @throws  {AppError} 404 - User not found
 */
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
