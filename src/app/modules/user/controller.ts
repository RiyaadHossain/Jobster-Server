import catchAsync from '@/shared/catchAsync';
import sendResponse from '@/shared/sendResponse';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { UserServices } from './service';
import { IUploadFile } from '@/interfaces/file';

const me: RequestHandler = catchAsync(async (req, res) => {
  const id = req.user.userId;
  const result = await UserServices.me(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile data retrived successfully',
    data: result,
  });
});

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
  const authUser = req.user;
  const file = req.file as IUploadFile;
  const filedName = req.body.field;
  const result = await UserServices.uploadImage(authUser, filedName, file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Image uploaded successfully',
    data: result,
  });
});

const getImageUrl: RequestHandler = catchAsync(async (req, res) => {
  const id = req.user.userId;
  const filedName = req.query.field as string;
  const result = await UserServices.getImageUrl(id, filedName);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Image URL retrived successfully',
    data: result,
  });
});

export const UserControllers = {
  me,
  signUp,
  confirmAccount,
  uploadImage,
  getImageUrl,
};
