require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');

    // Try to find an available port
    const server = app
      .listen(PORT)
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          logger.warn(`Port ${PORT} is busy, trying ${PORT + 1}`);
          server.listen(PORT + 1);
        } else {
          logger.error('Server error:', err);
        }
      })
      .on('listening', () => {
        const address = server.address();
        logger.info(`Server is running on port ${address.port}`);
      });
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});
