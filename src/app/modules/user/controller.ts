import catchAsync from '@/shared/catchAsync';
import sendResponse from '@/shared/sendResponse';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { UserServices } from './service';

const signUp: RequestHandler = catchAsync(async (req, res) => {
  const user = req.body.user;
  const name = req.body.name;
  const URL = req.protocol + '://' + req.get('host') + req.baseUrl;
  const result = await UserServices.signUp(user, name, URL);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Please check your email to confirm sign up.",
    data: result
  });
});

const confirmAccount: RequestHandler = catchAsync(async (req, res) => {
  const token = req.params.token;
  const name = req.params.name;
  const result = await UserServices.confirmAccount(name, token);

  let message = 'Something went wrong, please try later.';
  if (result)
    message = 'Congrantulations, User signed up successfully. Please sign in.';

  // TODO: Show a web page to user
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message,
  });
});

export const UserControllers = { signUp, confirmAccount };
