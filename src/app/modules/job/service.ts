import ApiError from '@/errors/ApiError';
import { IJob, IJobFilter } from './interface';
import Job from './model';
import httpStatus from 'http-status';
import { IPagination } from '@/interfaces/pagination';
import Company from '@modules/company/model';
import { SortOrder } from 'mongoose';
import { paginationHelpers } from '@/helpers/paginationHelper';
import User from '../user/model';
import { ENUM_EMPLOYMENT_TYPE, ENUM_WORK_LEVEL } from '@/enums/job';

const createJob = async (payload: IJob, userId: string) => {
  const companyId = (await Company.findOne({ id: userId }))?._id;
  if (!companyId)
    throw new ApiError(httpStatus.NOT_FOUND, "Company doesn't exist");

  payload.company = companyId;

  const jobExist = await Job.findOne({
    company: companyId,
    title: payload.title,
  });
  if (jobExist)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'A Job offer with same name already exist'
    );

  const data = await Job.create(payload);

  return data;
};

const getAllJobs = async (pagination: IPagination, filters: IJobFilter) => {
  const { page, limit, skip, sortOrder, sortBy } =
    paginationHelpers.calculatePagination(pagination);

  // Sort condition
  const sortCondition: { [key: string]: SortOrder } = {};
  sortCondition[sortBy] = sortOrder;

  // Filter Options
  const { title, workLevel, employmentType, ...filtersData } = filters;

  const andConditions = [];

  // Search by Job Title
  if (title) {
    andConditions.push({
      title: { $regex: title, $options: 'i' },
    });
  }

  // Search by Location + Category
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: { $regex: value, $options: 'i' },
      })),
    });
  }

  // Filter by Work Level
  if (workLevel) {
    const arrayOfWorkLevel = workLevel.split(',');
    andConditions.push({
      workLevel: { $in: arrayOfWorkLevel },
    });
  }

  // Filter by Employment Type
  if (employmentType) {
    const arrayOfEmployemploymentType = employmentType.split(',');
    andConditions.push({
      employmentType: { $in: arrayOfEmployemploymentType },
    });
  }

  const whereCondition = andConditions.length ? { $and: andConditions } : {};

  const jobs = await Job.find(whereCondition)
    .populate({ path: 'company', select: '_id name logo' })
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await Job.countDocuments(whereCondition);

  const meta = { total, page, limit };

  return { meta, data: jobs };
};

const getTypeSpecifiJobs = async () => {
  const employmentType = await Promise.all(
    Object.values(ENUM_EMPLOYMENT_TYPE).map(async item => {
      const jobs = await Job.countDocuments({ employmentType: item });
      return { type: item, jobs };
    })
  );

  const workLevel = await Promise.all(
    Object.values(ENUM_WORK_LEVEL).map(async item => {
      const jobs = await Job.countDocuments({ workLevel: item });
      return { type: item, jobs };
    })
  );

  return { employmentType, workLevel };
};

const getJob = async (id: string) => {
  const data = await Job.findById(id).populate('company').lean();

  const email = (await User.findOne({ id: data?.company.id }))?.email;

  return { ...data, email };
};

const updateJob = async (id: string, payload: IJob, userId: string) => {
  const jobExist = await Job.isJobExist(id);
  if (!jobExist)
    throw new ApiError(httpStatus.NOT_FOUND, 'Job record not found');

  const companyId = (await Company.findOne({ id: userId }))?._id;
  if (!companyId)
    throw new ApiError(httpStatus.NOT_FOUND, "Company doesn't exist");

  if (!(await Job.isJobCreator(id, companyId)))
    throw new ApiError(httpStatus.NOT_FOUND, "You didn't posted this job");

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
    throw new ApiError(httpStatus.NOT_FOUND, "You didn't posted this job");

  const data = await Job.findByIdAndDelete(id);

  return data;
};

export const JobServices = {
  createJob,
  getAllJobs,
  getTypeSpecifiJobs,
  getJob,
  updateJob,
  deleteJob,
};
