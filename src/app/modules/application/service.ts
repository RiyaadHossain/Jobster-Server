import ApiError from '@/errors/ApiError';
import { IApplication } from './interface';
import { ApplicationUtils } from './utils';
import httpStatus from 'http-status';
import Application from './model';

const apply = async (payload: IApplication, userId: string) => {
  if (!(await ApplicationUtils.isJobExist(payload.job as unknown as string)))
    throw new ApiError(httpStatus.NOT_FOUND, "Job offer doesn't exist");

  const candidate = await ApplicationUtils.isCandidateExist(userId);
  if (!candidate)
    throw new ApiError(httpStatus.NOT_FOUND, 'Candidate account not exist');

  const alreadyApplied = await Application.findOne({
    job: payload.job,
    candidate: candidate._id,
  });

  if (alreadyApplied)
    throw new ApiError(httpStatus.NOT_FOUND, 'Already applied for this job');

  payload.candidate = candidate._id;

  const data = await Application.create(payload);
  return data;
};

const myApplications = async (userId: string) => {
  const candidate = await ApplicationUtils.isCandidateExist(userId);
  if (!candidate)
    throw new ApiError(httpStatus.NOT_FOUND, 'Candidate account not exist');

  const data = await Application.find({ candidate: candidate._id }).populate({
    path: 'job',
    populate: 'company',
  });
  return data;
};

const remove = async (id: string, userId: string) => {
  const application = await Application.findById(id);
  if (!application)
    throw new ApiError(httpStatus.NOT_FOUND, "Job application doesn't exist");

  const candidate = await ApplicationUtils.isCandidateExist(userId);
  if (!candidate)
    throw new ApiError(httpStatus.NOT_FOUND, 'Candidate account not exist');

  if (!application.candidate.equals(candidate._id))
    throw new ApiError(httpStatus.NOT_FOUND, 'This application is not yours');

  const data = await Application.findByIdAndDelete(id);
  return data;
};

export const ApplicaitonServices = { apply, myApplications, remove };
