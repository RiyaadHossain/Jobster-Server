import ApiError from '@/errors/ApiError';
import { IJob } from './interface';
import Job from './model';
import httpStatus from 'http-status';
import { IPagination } from '@/interfaces/pagination';
import { IFilters } from '@/interfaces/common';
import Company from '@modules/company/model';
import { SortOrder } from 'mongoose';
import { paginationHelpers } from '@/helpers/paginationHelper';
import { filterAbleFields } from './constant';

const createJob = async (payload: IJob, userId: string) => {
  const companyId = (await Company.findOne({ id: userId }))?._id;
  if (!companyId)
    throw new ApiError(httpStatus.NOT_FOUND, "Company doesn't exist");

  payload.company = companyId;

  const data = await Job.create(payload);

  return data;
};

const getAllJobs = async (pagination: IPagination, filters: IFilters) => {
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

  const Jobs = await Job.find(whereCondition)
    .populate({ path: 'company', select: '_id name' })
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await Job.countDocuments(whereCondition);

  const meta = { total, page, limit };

  return { meta, data: Jobs };
};

const getJob = async (id: string) => {
  const data = await Job.findById(id).populate('company');

  return data;
};

const updateJob = async (id: string, payload: IJob, userId: string) => {
  const jobExist = await Job.isJobExist(id);
  if (!jobExist)
    throw new ApiError(httpStatus.NOT_FOUND, 'Job record not found');

  const companyId = (await Company.findOne({ id: userId }))?._id;
  if (!companyId)
    throw new ApiError(httpStatus.NOT_FOUND, "Company doesn't exist");

  if (!(await Job.isJobCreator(id, companyId)))
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "You didn't posted this job"
    );

  const data = await Job.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return data;
};

const deleteJob = async (id: string, userId: string) => {
  const jobExist = await Job.isJobExist(id);
  if (!jobExist)
    throw new ApiError(httpStatus.NOT_FOUND, 'Job record not found');

  const companyId = (await Company.findOne({ id: userId }))?._id;
  if (!companyId)
    throw new ApiError(httpStatus.NOT_FOUND, "Company doesn't exist");

  if (!(await Job.isJobCreator(id, companyId)))
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "You didn't posted this job"
    );

  const data = await Job.findByIdAndDelete(id);

  return data;
};

export const JobServices = {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
};
