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
  const userId = authUser.userId;
  const role = authUser.role;

  const user = await User.getRoleSpecificDetails(userId);

  if (!user)
    throw new ApiError(httpStatus.NOT_FOUND, "User account doesn't exist");

  let jobs = 0;
  if (role === ENUM_USER_ROLE.COMPANY)
    jobs = await Job.countDocuments({ company: user._id });
  if (role === ENUM_USER_ROLE.CANDIDATE)
    jobs = await Application.countDocuments({ candidate: user._id });

  const profileViews = await ProfileView.countDocuments({ userId });

  const unreadMessages = Math.floor(Math.random() * 50) + 1;

  const notifications = await Notification.countDocuments({
    'to._id': user._id,
  });

  return { jobs, profileViews, unreadMessages, notifications };
};

const profileViewStat = async (authUser: JwtPayload, totalMonths: number) => {
  const userId = authUser.userId;

  const user = await User.getRoleSpecificDetails(userId);

  if (!user)
    throw new ApiError(httpStatus.NOT_FOUND, "User account doesn't exist");

  let lastNthMonthInfo = DashboardUtils.getLastNthMonth(totalMonths);

  const lastDate = DashboardUtils.getDateFromNthMonthBack(totalMonths);
  const profileViews = await ProfileView.find({
    userId,
    viewedAt: { $gte: lastDate },
  });

  lastNthMonthInfo = lastNthMonthInfo.map(date => {
    let views = 0;
    profileViews.forEach(item => {
      const month = months[item.viewedAt.getMonth()];
      const year = item.viewedAt.getFullYear();
      if (month === date.month && year === date.year) views++;
    });

    return { ...date, views };
  });

  return lastNthMonthInfo;
};

const applicationStat = async (authUser: JwtPayload, totalMonths: number) => {
  const userId = authUser.userId;

  const user = await User.getRoleSpecificDetails(userId);

  if (!user)
    throw new ApiError(httpStatus.NOT_FOUND, "User account doesn't exist");

  let lastNthMonthInfo = DashboardUtils.getLastNthMonth(totalMonths);

  const lastDate = DashboardUtils.getDateFromNthMonthBack(totalMonths);

  let applications: IApplication[] = [];

  // Role -> Company
  if (authUser.role === ENUM_USER_ROLE.COMPANY) {
    const jobs = await Job.find({ company: user._id });
    const jobIds = jobs.map(job => job._id);
    applications = await Application.find({
      job: { $in: jobIds },
      createdAt: { $gte: lastDate },
    });
  }

  // Role -> Candidate
  if (authUser.role === ENUM_USER_ROLE.CANDIDATE) {
    applications = await Application.find({
      candidate: user._id,
      createdAt: { $gte: lastDate },
    });
  }

  lastNthMonthInfo = lastNthMonthInfo.map(date => {
    let application = 0;
    applications.forEach(item => {
      const month = months[item.createdAt.getMonth()];
      const year = item.createdAt.getFullYear();
      if (month === date.month && year === date.year) application++;
    });

    return { ...date, application };
  });

  return lastNthMonthInfo;
};

export const DashboardServices = { overview, profileViewStat, applicationStat };
