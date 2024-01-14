import catchAsync from '@/shared/catchAsync';
import sendResponse from '@/shared/sendResponse';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { DashboardServices } from './services';

const overview: RequestHandler = catchAsync(async (req, res) => {
  const authUser = req.user;
  const result = await DashboardServices.overview(authUser);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard overview data retrived successfully',
    data: result,
  });
});

const profileViewStat: RequestHandler = catchAsync(async (req, res) => {
  const authUser = req.user;
  const months = Number(req.query.months);
  const result = await DashboardServices.profileViewStat(authUser, months);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard profile view stat data retrived successfully',
    data: result,
  });
});

const applicationStat: RequestHandler = catchAsync(async (req, res) => {
  const authUser = req.user;
  const months = Number(req.query.months);
  const result = await DashboardServices.applicationStat(authUser, months);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard application stat data retrived successfully',
    data: result,
  });
});

export const DashboardControllers = { overview, profileViewStat, applicationStat };
