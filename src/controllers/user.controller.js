const { AppError } = require('../middleware/errorHandler');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const { v4: uuidv4 } = require('uuid');
const S3Service = require('../services/aws/s3/s3');

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
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Get a specific user by ID
 *
 * @route   GET /api/v1/users/:id
 * @param   {string} req.params.id - User ID
 * @returns {Object} 200 - User object
 * @throws  {AppError} 404 - User not found
 */
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Create a new user
 *
 * @route   POST /api/v1/users
 * @param   {Object} req.body - User data (validated by middleware)
 * @returns {Object} 201 - Created user object with auth token
 */
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    // Generate token
    const token = user.generateAuthToken();

    // Remove password from output
    user.password = undefined;

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: user.toPublicJSON(),
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Update an existing user
 *
 * @route   PATCH /api/v1/users/:id
 * @param   {string} req.params.id - User ID
 * @param   {Object} req.body - Updated user data (validated by middleware)
 * @returns {Object} 200 - Updated user object
 * @throws  {AppError} 404 - User not found
 */
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Delete a user
 *
 * @route   DELETE /api/v1/users/:id
 * @param   {string} req.params.id - User ID
 * @returns {null} 204 - No content
 * @throws  {AppError} 404 - User not found
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.uploadProfilePicture = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const { imageBase64, mimeType } = req.body;
  const fileName = `profile-${uuidv4()}.${mimeType.split('/')[1]}`;
  const s3Service = new S3Service();

  // Delete existing profile picture if it exists
  if (user.profilePicture) {
    const existingFileName = user.profilePicture.split('/').pop();
    await s3Service.deleteProfilePicture(existingFileName);
  }

  // Upload new profile picture
  const uploadResult = await s3Service.uploadProfilePicture(imageBase64, mimeType, fileName);

  const bucketName = process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_REGION;
  const profilePictureUrl = `https://${bucketName}.s3.${region}.amazonaws.com/profile-pictures/${fileName}`;

  user.profilePicture = profilePictureUrl;
  await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      profilePictureUrl,
      metadata: uploadResult.$metadata,
    },
  });
});
