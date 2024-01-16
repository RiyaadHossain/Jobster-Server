/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import config from '@/config';
import ApiError from '@/errors/ApiError';
import handleValidationError from '@/errors/handleValidationError';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

import handleCastError from '@/errors/handleCastError';
import handleZodError from '@/errors/handleZodError';
import { IGenericErrorMessage } from '@/interfaces/error';
import { ZodError } from 'zod';
import handleJWTError from '@/errors/handleJWTError';
import multer from 'multer';

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  config.ENV === 'development'
    ? console.log(`🐱 globalErrorHandler ~~`, { error })
    : console.log(`🐱 globalErrorHandler ~~`, error);

  let type = '';
  let statusCode = 500;
  let message = 'Something went wrong !';
  let errorMessages: IGenericErrorMessage[] = [];

  if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error?.name === 'CastError') {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof multer.MulterError) {
    statusCode = 400;
    message = 'An error occured while uploading file';
    errorMessages = [{ path: '', message: 'Error while uploading file' }];
  } else if (
    error?.name === 'JsonWebTokenError' ||
    error?.name === 'TokenExpiredError'
  ) {
    const simplifiedError = handleJWTError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    type = simplifiedError.type;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    type,
    message,
    errorMessages,
    stack: config.ENV !== 'production' ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
