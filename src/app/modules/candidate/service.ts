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
import { IUploadFile } from '@/interfaces/file';
import { FileUploader } from '@/helpers/fileUploader';
import { ENUM_FILE_TYPE } from '@/enums/file';
import ProfileView from '../dashboard/model';

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
  const candidate = await Candidate.findById(id);

  const currentMin = new Date();
  const oneMinEarlier = new Date(
    currentMin.setMinutes(currentMin.getMinutes() - 2)
  );
  const viewed = await ProfileView.findOne({
    userId: candidate?._id,
    viewedBy: authUser?.userId,
    viewedAt: { $gte: oneMinEarlier },
  });

  if (!viewed && authUser && candidate) {
    await ProfileView.create({
      userId: candidate.id,
      viewedBy: authUser.userId,
    });

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

const uploadResume = async (userId: string, file: IUploadFile) => {
  if (!file)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Must be uploaded a resume');

  const uploadedResume = await FileUploader.uploadToCloudinary(
    file,
    ENUM_FILE_TYPE.PDF
  );

  // 1. Check Candidate account exist
  const candidate = await Candidate.findOne({ id: userId });

  if (!candidate)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Candidate account doesn't exist!"
    );

  // 2. Save fileName and fileURL
  candidate.resume = {
    fileName: file.originalname,
    fileURL: uploadedResume.secure_url,
  };
  await candidate.save();
};

export const CandidateServices = {
  getAllCandidates,
  getCandidate,
  editProfile,
  uploadResume,
};
