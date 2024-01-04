import catchAsync from '@/shared/catchAsync';
import sendResponse from '@/shared/sendResponse';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { ApplicaitonServices } from './service';

const apply: RequestHandler = catchAsync(async (req, res) => {
  const applicationData = req.body;
  const userId = req.user?.userId;
  const result = await ApplicaitonServices.apply(applicationData, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Job Applied successfully',
    data: result,
  });
});

const myApplications: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const result = await ApplicaitonServices.myApplications(userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'My Applications retrived successfully',
    data: result,
  });
});

const updateStatus: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;
  const userId = req.user?.userId;
  const result = await ApplicaitonServices.updateStatus(id, status, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Job application status updated successfully',
    data: result,
  });
});

const remove: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const userId = req.user?.userId;
  const result = await ApplicaitonServices.remove(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Job application removed successfully',
    data: result,
  });
});

export const ApplicationControllers = {
  apply,
  myApplications,
  updateStatus,
  remove,
};
