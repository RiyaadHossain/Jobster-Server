import { paginationFields } from '@/constants/pagination';
import catchAsync from '@/shared/catchAsync';
import pick from '@/shared/pick';
import sendResponse from '@/shared/sendResponse';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { searchAndFilterAbleFields } from './constant';
import { CompanyServices } from './service';

const getAllCompanies: RequestHandler = catchAsync(async (req, res) => {
  const pagination = pick(req.query, paginationFields);
  const filters = pick(req.query, searchAndFilterAbleFields);
  const { meta, data } = await CompanyServices.getAllCompanies(
    pagination,
    filters
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Companies data retrived successfully',
    meta,
    data,
  });
});

const getCompany: RequestHandler = catchAsync(async (req, res) => {
  const user = req?.user;
  const id = req.params.id;
  const result = await CompanyServices.getCompany(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Company data retrived successfully',
    data: result,
  });
});

const editProfile: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const companyData = req.body;
  const result = await CompanyServices.editProfile(userId, companyData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Company profile updated successfully',
    data: result,
  });
});

const myJobs: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const result = await CompanyServices.myJobs(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My jobs data retrieved successfully',
    data: result,
  });
});

const appliedCandidates: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const result = await CompanyServices.appliedCandidates(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Applied candidates data successfully',
    data: result,
  });
});

export const CompanyControllers = {
  getAllCompanies,
  getCompany,
  editProfile,
  myJobs,
  appliedCandidates,
};
