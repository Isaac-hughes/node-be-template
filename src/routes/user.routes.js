const express = require('express');
const userController = require('../controllers/user.controller');
const { validateUser, validateUserUpdate } = require('../middleware/validation');

/**
 * User Routes
 *
 * Base Path: /api/v1/users
 *
 * This router handles all user-related endpoints including:
 * - User creation
 * - User retrieval (single and list)
 * - User updates
 * - User deletion
 */
const router = express.Router();

/**
 * Collection Routes: /api/v1/users
 *
 * GET  - Retrieve all users
 * POST - Create a new user (requires validation)
 */
router.route('/').get(userController.getUsers).post(validateUser, userController.createUser);

/**
 * Individual User Routes: /api/v1/users/:id
 *
 * GET    - Retrieve a specific user
 * PATCH  - Update a specific user (requires validation)
 * DELETE - Remove a specific user
 */
router
  .route('/:id')
  .get(userController.getUser)
  .patch(validateUserUpdate, userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
