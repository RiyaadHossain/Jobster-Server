import catchAsync from '@/shared/catchAsync';
import sendResponse from '@/shared/sendResponse';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { NotificationServices } from './service';

const getAllNotifications: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await NotificationServices.getAllNotifications(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Notifications retrived successfully',
    data: result,
  });
});

const getUnreadNotificationsCount: RequestHandler = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await NotificationServices.getUnreadNotificationsCount(user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Unread notifications count retrived successfully',
      data: result,
    });
  }
);

const readAllNotifications: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await NotificationServices.readAllNotifications(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Notifications marked as read successfully',
    data: result,
  });
});

const deleteAllNotifications: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await NotificationServices.deleteAllNotifications(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Notifications deleted successfully',
    data: result,
  });
});

const deleteNotification: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user;
  const id = req.params.id;
  const result = await NotificationServices.deleteNotification(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification deleted successfully',
    data: result,
  });
});

export const NotificationControllers = {
  getAllNotifications,
  getUnreadNotificationsCount,
  readAllNotifications,
  deleteAllNotifications,
  deleteNotification,
};
