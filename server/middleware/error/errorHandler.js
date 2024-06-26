import AppError from './AppError.js';

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Set default values for the error response
  let statusCode = err.statusCode || 500;
  let status = err.status || 'error';
  let message = err.message || 'Internal Server Error';

  // Send the error response
  res.status(statusCode).json({
    status: status,
    message: message,
  });
};

export default errorHandler; 

