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
import { INotification } from '../notiifcaiton/interface';
import { ENUM_USER_ROLE } from '@/enums/user';
import { NotificationServices } from '../notiifcaiton/service';
import { ENUM_NOFICATION_TYPE } from '@/enums/notification';
import ProfileView from '../dashboard/model';

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

  const compnaies = await Company.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await Company.countDocuments(whereCondition);

  const meta = { total, page, limit };

  return { meta, data: compnaies };
};

const getCompany = async (id: string, authUser: JwtPayload | null) => {
  if (!authUser)
    throw new ApiError(httpStatus.BAD_REQUEST, 'User credential is missing');

  const company = await Company.findById(id);

  if (authUser && company) {
    await ProfileView.create({
      userId: company._id,
      viewedBy: authUser.userId,
    });

    // Send notification to company
    const user = await User.getRoleSpecificDetails(authUser.userId);

    if (!user)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Notification sender account doesn't exist"
      );

    const notificationPayload: INotification = {
      type: ENUM_NOFICATION_TYPE.PROFILE_VIEW,
      from: { _id: user._id, name: user.name, role: authUser.role },
      to: {
        _id: company._id,
        name: company.name,
        role: ENUM_USER_ROLE.COMPANY,
      },
    };

    NotificationServices.createNotification(notificationPayload);
  }

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

const myJobs = async (userId: string) => {
  const company = await Company.findOne({ id: userId });
  if (!company)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Company account is not exist!');

  const jobs = await Job.find({ company: company._id });

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


const appliedCandidates = async (userId: string) => {
  const company = await Company.findOne({ id: userId });
  if (!company)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Company account is not exist!');

  const jobs = await Job.find({ company: company._id });
  const jobIds = jobs.map(job => job._id);

  const applications = await Application.find({
    job: { $in: jobIds },
  }).populate([
    { path: 'job', select: '_id title' },
    { path: 'candidate', select: '_id name location' },
  ]);

  return applications;
};

export const CompanyServices = {
  getAllCompanies,
  getCompany,
  editProfile,
  myJobs,
  appliedCandidates,
};
