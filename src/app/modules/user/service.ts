import { ENUM_USER_ROLE } from '@/enums/user';
import ApiError from '@/errors/ApiError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Candidate from '../candidate/model';
import Company from '../company/model';
import { IUser } from './interface';
import User from './model';
import { UserUtils } from './utils';

const signUp = async (payload: IUser, name: string) => {
  // 1. Is user exist
  const isExist = await User.findOne({ email: payload.email });
  if (isExist)
    throw new ApiError(httpStatus.BAD_REQUEST, 'User account is already exist');

  let finalUserData = null;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    let userInfo = null;
    const userData = { name, id: '' };

    // 2. Generate userId
    const id = await UserUtils.generateId(payload.role);
    userData.id = id;
    payload.id = id;

    // 3. Create Company/Candidate account
    if (payload.role === ENUM_USER_ROLE.COMPANY) {
      userInfo = await Company.create([userData], { session });
      payload.company = userInfo[0]._id;
    } else if (payload.role === ENUM_USER_ROLE.CANDIDATE) {
      userInfo = await Candidate.create([userData], { session });
      payload.candidate = userInfo[0]._id;
    }

    if (!userInfo)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create user account'
      );

    const user = await User.create([payload], { session });

    if (!user)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create user account'
      );

    finalUserData = user;

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }

  return finalUserData;
};

export const UserServices = { signUp };
