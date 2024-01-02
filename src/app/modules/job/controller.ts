import catchAsync from '@/shared/catchAsync';
import sendResponse from '@/shared/sendResponse';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { JobServices } from './service';
import pick from '@/shared/pick';
import { paginationFields } from '@/constants/pagination';
import { searchAndFilterAbleFields } from './constant';

const createJob: RequestHandler = catchAsync(async (req, res) => {
  const jobData = req.body;
  const userId = req.user?.userId;
  const result = await JobServices.createJob(jobData, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New Job Offer created successfully',
    data: result,
  });
});

const getAllJobs: RequestHandler = catchAsync(async (req, res) => {
  const pagination = pick(req.query, paginationFields);
  const filters = pick(req.query, searchAndFilterAbleFields);
  const result = await JobServices.getAllJobs(pagination, filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Job data retrived successfully',
    data: result,
  });
});

const getJob: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await JobServices.getJob(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job data retrived successfully',
    data: result,
  });
});

const updateJob: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const jobData = req.body;
  const userId = req.user?.userId;
  const result = await JobServices.updateJob(id, jobData, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job data updated successfully',
    data: result,
  });
});

const deleteJob: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const userId = req.user?.userId;
  const result = await JobServices.deleteJob(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job data deleted successfully',
    data: result,
  });
});

export const JobControllers = {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
};
