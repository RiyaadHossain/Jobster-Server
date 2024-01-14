import config from '@config';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { AuthServices } from './service';
import catchAsync from '@/shared/catchAsync';
import sendResponse from '@/shared/sendResponse';

const signIn: RequestHandler = catchAsync(async (req, res) => {
  const userCredential = req.body;
  const { refreshToken, accessToken } = await AuthServices.signIn(
    userCredential
  );

  // Set Cookie
  const cookieOptions = {
    secure: config.ENV === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User signed in successfully',
    data: { accessToken },
  });
});

const accessToken: RequestHandler = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.accessToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token generated successfully',
    data: result,
  });
});

const changePassword: RequestHandler = catchAsync(async (req, res) => {
  const userCredential = req.body;
  const user = req.user?.userId as string;
  await AuthServices.changePassword(userCredential, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
  });
});

const forgetPassword: RequestHandler = catchAsync(async (req, res) => {
  const email = req.body.email;
  await AuthServices.forgetPassword(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Please check your email to reset password',
  });
});

const resetPassword: RequestHandler = catchAsync(async (req, res) => {
  const resetCredential = req.body;
  await AuthServices.resetPassword(resetCredential);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is reset successfully',
  });
});

export const AuthControllers = {
  signIn,
  accessToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
