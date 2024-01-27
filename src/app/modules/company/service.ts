import ApiError from '@/errors/ApiError';
import { paginationHelpers } from '@/helpers/paginationHelper';
import { IFilters } from '@/interfaces/common';
import { IPagination } from '@/interfaces/pagination';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import User from '../user/model';
import { filterAbleFields } from './constant';
import { ICompany } from './interface';
import Company from './model';
import Job from '../job/model';
import Application from '../application/model';
import { CandidateUtils } from '../candidate/utils';
import { IApplicationPopulated } from '../application/interface';
import { IJobQuery } from '../job/interface';

const getAllCompanies = async (pagination: IPagination, filters: IFilters) => {
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

  let compnaies = await Company.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit)
    .lean();

  compnaies = await Promise.all(
    compnaies.map(async company => {
      const jobs = await Job.countDocuments({ company: company._id });
      return { ...company, jobs };
    })
  );

  const total = await Company.countDocuments(whereCondition);
  const totalPages = Math.ceil(total / limit);

  const meta = { total, page, limit, totalPages };

  return { meta, data: compnaies };
};

const getCompany = async (id: string, authUser: JwtPayload) => {
  const company = await Company.findById(id).lean();

  if (!company)
    throw new ApiError(httpStatus.BAD_REQUEST, "Company account doesn't exist");

  const email = (await User.findOne({ id: company.id }))?.email as string;
  company.email = email;

  CandidateUtils.countProfileView(authUser, company);

  const availableJobs = await Job.find({ company: id });

  return { company, availableJobs };
};

const editProfile = async (userId: string, payload: ICompany) => {
  const user = await User.isUserExist(userId);

  if (!user)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Company account is not exist!');

  const updatedData = await Company.findByIdAndUpdate(user.company, payload, {
    new: true,
    runValidators: true,
  });

  return updatedData;
};

const myJobs = async (userId: string, searchTerm: string) => {
  const company = await Company.findOne({ id: userId });
  if (!company)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Company account is not exist!');

  const query: IJobQuery = { company: company._id };
  if (searchTerm) query['title'] = { $regex: searchTerm, $options: 'i' };

  const jobs = await Job.find(query);

  // Create an array to store job details along with applications' ids
  const jobsWithApplications = await Promise.all(
    jobs.map(async job => {
      const applications = await Application.find({
        job: job._id,
      });

      const applicationIds = applications.map(application => application._id);

      return {
        job: job.toObject(),
        applications: applicationIds,
      };
    })
  );

  return jobsWithApplications;
};

const appliedCandidates = async (userId: string, searchTerm: string) => {
  const company = await Company.findOne({ id: userId });
  if (!company)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Company account is not exist!');

  const jobs = await Job.find({ company: company._id });
  const jobIds = jobs.map(job => job._id);

  const data: IApplicationPopulated[] = await Application.find({
    job: { $in: jobIds },
  }).populate([
    { path: 'job', select: '_id title industry location' },
    { path: 'candidate', select: '_id name avatar location industry' },
  ]);

  let filteredData = data;
  if (searchTerm)
    filteredData = data.filter(item => {
      searchTerm = searchTerm?.toLowerCase();
      const jobTitle = item?.job?.title?.toLowerCase();
      const companyName = item?.candidate?.name?.toLowerCase();

      // @ts-ignore
      return jobTitle.includes(searchTerm) || companyName.includes(searchTerm);
    });

  return filteredData;
};

export const CompanyServices = {
  getAllCompanies,
  getCompany,
  editProfile,
  myJobs,
  appliedCandidates,
};
