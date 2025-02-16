const { AppError } = require('../middleware/errorHandler');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const { v4: uuidv4 } = require('uuid');
const S3Service = require('../services/aws/s3/s3');
const { sendEmail } = require('../services/sendgrid/sendgrid');
const {
  generateWelcomeEmailContent,
} = require('../services/sendgrid/templates/welcomeEmailTemplate');

exports.getUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res) => {
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
});

exports.createUser = catchAsync(async (req, res) => {
  const user = await User.create(req.body);

  // Generate token
  const token = user.generateAuthToken();

  // Send welcome email
  try {
    await sendEmail({
      to: user.email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Welcome to Our Platform!',
      text: `Hi ${user.firstName}, welcome to our platform!`,
      html: generateWelcomeEmailContent(user.firstName),
    });
  } catch (error) {
    // Log the error but don't fail the user creation
    console.error('Error sending welcome email:', error);
  }

  // Remove password from output
  user.password = undefined;

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: user.toPublicJSON(),
    },
  });
});

exports.updateUser = catchAsync(async (req, res) => {
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
});

exports.deleteUser = catchAsync(async (req, res) => {
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
});

exports.getProfile = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});

exports.updateProfile = catchAsync(async (req, res) => {
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
});

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

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
