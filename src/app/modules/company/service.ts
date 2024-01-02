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

const getCompany = async (id: string, user: JwtPayload | null) => {
  const company = await Company.findById(id);

  if (user && company) {
    company.profileView++;
    company.save();
    // - Send notification
  }

  const availableJobs = /* await Job.find({ company: id }); */ '';

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

export const CompanyServices = { getAllCompanies, getCompany, editProfile };