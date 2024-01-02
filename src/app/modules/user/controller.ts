import catchAsync from '@/shared/catchAsync';
import sendResponse from '@/shared/sendResponse';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { UserServices } from './service';

const signUp: RequestHandler = catchAsync(async (req, res) => {
  const { user, name } = req.body;
  const result = await UserServices.signUp(user, name);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User signed up successfully',
    data: result,
  });
});

export const UserControllers = { signUp };
