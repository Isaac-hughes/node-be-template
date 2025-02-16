const express = require('express');
const userController = require('../controllers/user.controller');
const { validateUser, validateUserUpdate, validateProfilePicture } = require('../validations');
const { protect, restrictTo } = require('../middleware/auth.middleware');

/**
 * @openapi
 * paths:
 *   $ref: './docs/user.routes.yaml'
 */

const router = express.Router();

// Public routes
router.route('/').get(userController.getUsers).post(validateUser, userController.createUser);

// Protected routes - add these before the /:id routes
router.use(protect); // Protect all routes after this middleware

router.get('/profile', userController.getProfile);
router.patch('/update-profile', userController.updateProfile);
router.post('/profile-picture', validateProfilePicture, userController.uploadProfilePicture);
router.get('/all', restrictTo('admin'), userController.getAllUsers);

// ID routes should come last
router
  .route('/:id')
  .get(userController.getUser)
  .patch(validateUserUpdate, userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
