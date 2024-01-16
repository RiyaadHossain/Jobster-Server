import httpStatus from 'http-status';

const handleJWTError = (error: Error) => {
  const type = 'TokenExpired';
  let statusCode: number = httpStatus.BAD_REQUEST;
  let message = 'Invalid Token';
  let errorMessages = [{ path: '', message: 'Invalid Token' }];

  if (error.name === 'TokenExpiredError') {
    statusCode = httpStatus.UNAUTHORIZED;
    message = 'Token is expired';
    errorMessages = [{ path: '', message: 'Token is expired' }];
  }

  return { type, statusCode, message, errorMessages };
};

export default handleJWTError;
