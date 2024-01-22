import { paginationFields } from '@/constants/pagination';
import catchAsync from '@/shared/catchAsync';
import pick from '@/shared/pick';
import sendResponse from '@/shared/sendResponse';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { searchAndFilterAbleFields } from './constant';
import { CandidateServices } from './service';
import { IUploadFile } from '@/interfaces/file';

const getAllCandidates: RequestHandler = catchAsync(async (req, res) => {
  const pagination = pick(req.query, paginationFields);
  const filters = pick(req.query, searchAndFilterAbleFields);
  const { meta, data } = await CandidateServices.getAllCandidates(
    pagination,
    filters
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Candidates data retrived successfully',
    meta,
    data,
  });
});

const getCandidate: RequestHandler = catchAsync(async (req, res) => {
  const user = req?.user;
  const id = req.params.id;
  const result = await CandidateServices.getCandidate(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Candidate data retrived successfully',
    data: result,
  });
});

const editProfile: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const candidateData = req.body;
  const result = await CandidateServices.editProfile(userId, candidateData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Candidate profile updated successfully',
    data: result,
  });
});

const uploadResume: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const file = req.file as IUploadFile;
  const result = await CandidateServices.uploadResume(userId, file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Resume uploaded successfully',
    data: result,
  });
});

const deleteResume: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  await CandidateServices.deleteResume(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Resume deleted successfully',
  });
});

export const CandidateControllers = {
  getAllCandidates,
  getCandidate,
  editProfile,
  uploadResume,
  deleteResume,
};
