const express = require('express');
const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
  });
});

// Mount other route modules here
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// etc...

// 404 handler for undefined routes
router.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

module.exports = router;
