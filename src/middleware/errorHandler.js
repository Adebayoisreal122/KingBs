const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `This ${field} is already in use.`;
    statusCode = 409;
  }
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(e => e.message).join('. ');
    statusCode = 400;
  }
  if (err.name === 'CastError') { message = `Invalid ID: ${err.value}`; statusCode = 400; }
  if (err.name === 'JsonWebTokenError') { message = 'Invalid token.'; statusCode = 401; }
  if (err.name === 'TokenExpiredError') { message = 'Session expired. Please log in again.'; statusCode = 401; }

  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Something went wrong. Please try again.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };
