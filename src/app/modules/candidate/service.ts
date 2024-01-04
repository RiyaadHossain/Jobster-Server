import ApiError from '@/errors/ApiError';
import { paginationHelpers } from '@/helpers/paginationHelper';
import { IFilters } from '@/interfaces/common';
import { IPagination } from '@/interfaces/pagination';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import User from '../user/model';
import { filterAbleFields } from './constant';
import { ICandidate } from './interface';
import Candidate from './model';
import { NotificationServices } from '../notiifcaiton/service';
import { INotification } from '../notiifcaiton/interface';
import { ENUM_NOFICATION_TYPE } from '@/enums/notification';
import { ENUM_USER_ROLE } from '@/enums/user';

const getAllCandidates = async (pagination: IPagination, filters: IFilters) => {
  const { page, limit, skip, sortOrder, sortBy } =
    paginationHelpers.calculatePagination(pagination);

  // Sort condition
  const sortCondition: { [key: string]: SortOrder } = {};
  sortCondition[sortBy] = sortOrder;

  // Filter Options
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: filterAbleFields.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: { $regex: value, $options: 'i' },
      })),
    });
  }

  const whereCondition = andConditions.length ? { $and: andConditions } : {};

  const Candidates = await Candidate.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await Candidate.countDocuments(whereCondition);

  const meta = { total, page, limit };

  return { meta, data: Candidates };
};

const getCandidate = async (id: string, authUser: JwtPayload | null) => {
  const candidate = await Candidate.findById(id).select('_id name');

  if (authUser && candidate) {
    candidate.profileView++;
    candidate.save();

    // Send notification to candidate
    const user = await User.getRoleSpecificDetails(authUser.userId);

    if (!user)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Notification sender account doesn't exist"
      );

    const notificationPayload: INotification = {
      type: ENUM_NOFICATION_TYPE.APPLY,
      from: { _id: user._id, name: user.name, role: authUser.role },
      to: {
        _id: candidate._id,
        name: candidate.name,
        role: ENUM_USER_ROLE.CANDIDATE,
      },
    };

    NotificationServices.createNotification(notificationPayload);
  }

  return candidate;
};

const editProfile = async (userId: string, payload: ICandidate) => {
  const user = await User.isUserExist(userId);

  if (!user)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Candidate account is not exist!'
    );

  const updatedData = await Candidate.findByIdAndUpdate(
    user.candidate,
    payload,
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedData;
};

export const CandidateServices = {
  getAllCandidates,
  getCandidate,
  editProfile,
};
