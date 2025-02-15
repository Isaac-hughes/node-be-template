const express = require('express');
const userController = require('../controllers/user.controller');
const { validateUser, validateUserUpdate } = require('../validations');
const { protect, restrictTo } = require('../middleware/auth.middleware');

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @openapi
 * /api/users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *
 * /api/users/update-profile:
 *   patch:
 *     tags: [Users]
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *
 * /api/users/all:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not an admin
 */

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
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

// Public routes
router.route('/').get(userController.getUsers).post(validateUser, userController.createUser);

// Protected routes - add these before the /:id routes
router.use(protect); // Protect all routes after this middleware

router.get('/profile', userController.getProfile);
router.patch('/update-profile', userController.updateProfile);
router.get('/all', restrictTo('admin'), userController.getAllUsers);

// ID routes should come last
router
  .route('/:id')
  .get(userController.getUser)
  .patch(validateUserUpdate, userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
