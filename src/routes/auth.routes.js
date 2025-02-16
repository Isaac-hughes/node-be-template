const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

/**
 * @openapi
 * paths:
 *   $ref: './docs/auth.routes.yaml'
 */

const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', protect, authController.logout);

module.exports = router;
