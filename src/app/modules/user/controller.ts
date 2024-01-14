import catchAsync from '@/shared/catchAsync';
import sendResponse from '@/shared/sendResponse';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { UserServices } from './service';
import { IUploadFile } from '@/interfaces/file';

const signUp: RequestHandler = catchAsync(async (req, res) => {
  const user = req.body.user;
  const name = req.body.name;
  const URL = req.protocol + '://' + req.get('host') + req.baseUrl;
  const result = await UserServices.signUp(user, name, URL);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Please check your email to confirm sign up.',
    data: result,
  });
});

const confirmAccount: RequestHandler = catchAsync(async (req, res) => {
  const token = req.params.token;
  const name = req.params.name;
  const result = await UserServices.confirmAccount(name, token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Account is verified successfully',
    data: result,
  });
});

const uploadImage: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const file = req.file as IUploadFile;
  const filedName = req.body.field;
  await UserServices.uploadImage(userId, filedName, file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Image uploaded successfully',
  });
});

export const UserControllers = { signUp, confirmAccount, uploadImage };
