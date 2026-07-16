import logger from '../utils/logger.js';

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'Internal server error';

  if (statusCode === 500) {
    logger.error('Unexpected error:', error);
  } else {
    logger.warn(`${statusCode} ${message}`);
  }

  const response = {
    success: false,
    message,
  };

  if (error.errors && error.errors.length > 0) {
    response.errors = error.errors;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
