const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Log the error for internal tracking
  logger.error(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode,
      // Only include stack trace in development
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
};

module.exports = errorHandler;
