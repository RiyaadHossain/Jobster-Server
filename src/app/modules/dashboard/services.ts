import { JwtPayload } from 'jsonwebtoken';
import Notification from '../notiifcaiton/model';
import User from '../user/model';
import ApiError from '@/errors/ApiError';
import httpStatus from 'http-status';
import { ENUM_USER_ROLE } from '@/enums/user';
import Job from '../job/model';
import Application from '../application/model';

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

  const profileViews = user.profileView;

  const unreadMessages = Math.floor(Math.random() * 50) + 1;

  const notifications = await Notification.countDocuments({
    'to._id': user._id,
  });

  return { jobs, profileViews, unreadMessages, notifications };
};

const applicationStat = async (authUser: JwtPayload) => {
  const userId = authUser.userId;
  const role = authUser.role;

  const user = await User.getRoleSpecificDetails(userId);

  if (!user)
      throw new ApiError(httpStatus.NOT_FOUND, "User account doesn't exist");
    
    
};

export const DashboardServices = { overview, applicationStat };
