import httpStatus from 'http-status';

const handleJWTError = (error: Error) => {
  const statusCode = httpStatus.BAD_REQUEST;
  let message = 'Invalid Token';
  let errorMessages = [{ path: '', message: 'Invalid Token' }];

  if (error.name === 'TokenExpiredError') {
    message = 'Token is expired';
    errorMessages = [{ path: '', message: 'Token is expired' }];
  }

  return { statusCode, message, errorMessages };
};

export default handleJWTError;
