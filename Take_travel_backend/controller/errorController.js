const AppError = require('./../utils/AppError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  // console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err,req, res) => {
  //A) API 
  if(req.originalUrl.startsWith('/api')){
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    })}

    // console.log("Error ",err);
    
    //B) RENDERED WEBSITE
    return res.status(err.statusCode).json({
        status: 'fail',
        message: err.message,
    });  
};

const sendErrorProd = (err,req, res) => {
  // Operational, trusted error: send message to client
  //A) API
  if(req.originalUrl.startsWith('/api')){
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }

    // Log error
    // console.error('ERROR 💥', err);

    // B) Render Website
    return res.status(err.statusCode).json({
        status: 'fail',
        message: err.message,
    });

    
    // Programming or other unknown error: don't leak error details
  } 
  if (err.isOperational) {
    return res.status(err.statusCode).json({
        status: 'fail',
        message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  }
  else {
    // 1) Log error
    // console.error('ERROR 💥', err);

    // 2) Send generic message
    return res.status(err.statusCode).json({
        status: 'fail',
        message: 'Sth went wrong Plese try again leater',
    });
  } 
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  // console.log("the global error handler is being called ")
  console.log("error",err)
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.log("development")
    sendErrorDev(err,req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);
    console.log("production",error.name)

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);

    sendErrorProd(error,req, res);
  }
};
