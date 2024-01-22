import { IGenericErrorResponse } from '@/interfaces/common';
import { IGenericErrorMessage } from '@/interfaces/error';
import { ZodError, ZodIssue } from 'zod';

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  let statusCode = 400;
  let message = 'Validation Error';
  let type = '';

  const errors: IGenericErrorMessage[] = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  const isRefreshTokenErr = errors.find(error => error.path === 'refreshToken');
  if (isRefreshTokenErr) {
    statusCode = 401;
    message = 'Refresh Token is required';
    type = 'TokenExpired';
  }

  return {
    statusCode,
    message,
    type,
    errorMessages: errors,
  };
};

export default handleZodError;
