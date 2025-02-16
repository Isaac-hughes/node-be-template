require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Maximum number of connection attempts
const MAX_RETRIES = process.env.MAX_RETRIES || 5;
const RETRY_DELAY = process.env.RETRY_DELAY || 5000;

// Connect to MongoDB with retry mechanism
const connectWithRetry = async (retryCount = 0) => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to MongoDB');
    startServer();
  } catch (error) {
    if (retryCount >= MAX_RETRIES) {
      logger.error('Failed to connect to MongoDB after multiple attempts:', error);
      process.exit(1);
    }

    logger.warn(
      `Failed to connect to MongoDB. Retrying in ${RETRY_DELAY / 1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`
    );
    setTimeout(() => connectWithRetry(retryCount + 1), RETRY_DELAY);
  }
};

// Start server function
const startServer = () => {
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
};

// Initial connection attempt
connectWithRetry();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  // Close server & exit process
  process.exit(1);
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(false, () => {
    logger.info('MongoDB connection closed.');
    process.exit(0);
  });
});
