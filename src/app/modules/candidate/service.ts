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
import { IUploadFile } from '@/interfaces/file';
import { FileUploader } from '@/helpers/fileUploader';
import { ENUM_FILE_TYPE } from '@/enums/file';
import { CandidateUtils } from './utils';

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
  const totalPages = Math.ceil(total / limit);

  const meta = { total, page, limit, totalPages };

  return { meta, data: Candidates };
};

const getCandidate = async (id: string, authUser: JwtPayload) => {
  const candidate = await Candidate.findById(id);

  if (!candidate)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Candidate account doesn't exist"
    );

  const email = (await User.findOne({ id: candidate.id }))?.email;

  CandidateUtils.countProfileView(authUser, candidate);

  // @ts-ignore
  return { ...candidate._doc, email };
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

const deleteResume = async (userId: string) => {
  const candidate = await Candidate.findOne({ id: userId });

  if (!candidate)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Candidate account doesn't exist!"
    );

  candidate.resume = undefined;
  await candidate.save();
};

export const CandidateServices = {
  getAllCandidates,
  getCandidate,
  editProfile,
  uploadResume,
  deleteResume,
};
