import { JwtPayload } from 'jsonwebtoken';
import Notification from '../notiifcaiton/model';
import User from '../user/model';
import ApiError from '@/errors/ApiError';
import httpStatus from 'http-status';
import { ENUM_USER_ROLE } from '@/enums/user';
import Job from '../job/model';
import Application from '../application/model';
import { DashboardUtils } from './utils';
import ProfileView from './model';
import { months } from './constant';
import { IApplication } from '../application/interface';

const overview = async (authUser: JwtPayload) => {
  const jobApplications = {
    type: 'job_applications',
    quantity: 0,
  };

  const profileViews = {
    type: 'profile_views',
    quantity: 0,
  };

  const unreadMessages = {
    type: 'unread_messages',
    quantity: 0,
  };

  const notifications = {
    type: 'notifications',
    quantity: 0,
  };

  const userId = authUser.userId;
  const role = authUser.role;

  const user = await User.getRoleSpecificDetails(userId);

  if (!user)
    throw new ApiError(httpStatus.NOT_FOUND, "User account doesn't exist");

  if (role === ENUM_USER_ROLE.COMPANY) {
    const jobs = await Job.find({ company: user._id });
    const jobIds = jobs.map(job => job._id);
    jobApplications.quantity = await Application.countDocuments({
      job: { $in: jobIds },
    });
  }
  if (role === ENUM_USER_ROLE.CANDIDATE)
    jobApplications.quantity = await Application.countDocuments({
      candidate: user._id,
    });

  profileViews.quantity = await ProfileView.countDocuments({ userId });

  unreadMessages.quantity = 0;

  notifications.quantity = await Notification.countDocuments({
    'to._id': user._id,
  });

  return [jobApplications, profileViews, unreadMessages, notifications];
};

const profileViewStat = async (authUser: JwtPayload, totalMonths: number) => {
  const userId = authUser.userId;

  const user = await User.getRoleSpecificDetails(userId);

  if (!user)
    throw new ApiError(httpStatus.NOT_FOUND, "User account doesn't exist");

  if (isNaN(totalMonths)) totalMonths = 6;

  let lastNthMonthInfo = DashboardUtils.getLastNthMonth(totalMonths);

  const lastDate = DashboardUtils.getDateFromNthMonthBack(totalMonths);

  const profileViews = await ProfileView.find({
    userId,
    viewedAt: { $gte: lastDate },
  });

  let totalViews = 0;
  lastNthMonthInfo = lastNthMonthInfo.map(date => {
    let views = 0;
    profileViews.forEach(item => {
      const month = months[item.viewedAt.getMonth()];
      const year = item.viewedAt.getFullYear();
      if (month === date.month && year === date.year) views++;
    });

    totalViews += views;
    date.month = `${date.month} ${date.year.toString().slice(-2)}`;
    return { ...date, views };
  });

  return { stats: lastNthMonthInfo, total: totalViews };
};

const applicationStat = async (authUser: JwtPayload, totalMonths: number) => {
  const userId = authUser.userId;

  const user = await User.getRoleSpecificDetails(userId);

  if (!user)
    throw new ApiError(httpStatus.NOT_FOUND, "User account doesn't exist");

  if (isNaN(totalMonths)) totalMonths = 6;

  let lastNthMonthInfo = DashboardUtils.getLastNthMonth(totalMonths);

  const lastDate = DashboardUtils.getDateFromNthMonthBack(totalMonths);

  let applicationsReceived: IApplication[] = [];

  // Role -> Company
  if (authUser.role === ENUM_USER_ROLE.COMPANY) {
    const jobs = await Job.find({ company: user._id });
    const jobIds = jobs.map(job => job._id);
    applicationsReceived = await Application.find({
      job: { $in: jobIds },
      createdAt: { $gte: lastDate },
    });
  }

  // Role -> Candidate
  if (authUser.role === ENUM_USER_ROLE.CANDIDATE) {
    applicationsReceived = await Application.find({
      candidate: user._id,
      createdAt: { $gte: lastDate },
    });
  }

  let totalApplications = 0;
  lastNthMonthInfo = lastNthMonthInfo.map(date => {
    let applications = 0;
    applicationsReceived.forEach(item => {
      const month = months[item.createdAt.getMonth()];
      const year = item.createdAt.getFullYear();
      if (month === date.month && year === date.year) applications++;
    });

    totalApplications += applications;
    date.month = `${date.month} ${date.year.toString().slice(-2)}`;
    return { ...date, applications };
  });

  return { stats: lastNthMonthInfo, total: totalApplications };
};

export const DashboardServices = { overview, profileViewStat, applicationStat };
