import httpStatus from 'http-status';
import ProfileView from '../dashboard/model';
import ApiError from '@/errors/ApiError';
import User from '../user/model';
import { ENUM_NOFICATION_TYPE } from '@/enums/notification';
import { INotification } from '../notiifcaiton/interface';
import { ENUM_USER_ROLE } from '@/enums/user';
import { NotificationServices } from '../notiifcaiton/service';
import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { ICandidate } from './interface';
import { ICompany } from '../company/interface';

type UserType = (ICandidate | ICompany) & {
  _id: Types.ObjectId;
};

const countProfileView = async (authUser: JwtPayload, user: UserType) => {
  // if user himself viewing his own profile
  if (authUser.userId === user.id) return;

  const currentMin = new Date();
  const oneMinEarlier = new Date(
    currentMin.setMinutes(currentMin.getMinutes() - 2)
  );

  const viewed = await ProfileView.findOne({
    userId: user?._id,
    viewedBy: authUser?.userId,
    viewedAt: { $gte: oneMinEarlier },
  });

  if (!viewed && authUser && user) {
    await ProfileView.create({
      userId: user.id,
      viewedBy: authUser.userId,
    });

    // Send notification to user
    const sender = await User.getRoleSpecificDetails(authUser.userId);

    if (!sender)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Notification sender account doesn't exist"
      );

    const receiverRole = (await User.findOne({ id: user.id }))
      ?.role as ENUM_USER_ROLE;

    const notificationPayload: INotification = {
      type: ENUM_NOFICATION_TYPE.PROFILE_VIEW,
      from: { _id: sender._id, name: sender.name, role: authUser.role },
      to: {
        _id: user._id,
        name: user.name,
        role: receiverRole,
      },
    };

    NotificationServices.createNotification(notificationPayload);
  }
};

export const CandidateUtils = { countProfileView };
