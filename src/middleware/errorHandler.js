import { ApplicationError } from '../errors/index.js';
import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  // Logging error
  logger.error('Error occurred:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    requestPath: req.path,
    requestMethod: req.method,
    requestId: req.id 
  });

  // If it custom error
  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }


  // For other errors
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' ? { detail: err.message } : {})
  });
};

// Wrapper for async functions
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};