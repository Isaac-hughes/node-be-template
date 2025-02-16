const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateLogin } = require('../validations');

/**
 * @openapi
 * paths:
 *   $ref: './docs/auth.routes.yaml'
 */

const router = express.Router();

router.post('/login', validateLogin, authController.login);
router.post('/logout', protect, authController.logout);

module.exports = router;
