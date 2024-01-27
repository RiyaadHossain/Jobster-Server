import ApiError from '@/errors/ApiError';
import { IApplication, IApplicationPopulated } from './interface';
import { ApplicationUtils } from './utils';
import httpStatus from 'http-status';
import Application from './model';
import { ENUM_APPLICATION_STATUS } from '@/enums/application';
import Company from '../company/model';
import { NotificationServices } from '../notiifcaiton/service';
import { ENUM_NOFICATION_TYPE } from '@/enums/notification';
import { ENUM_USER_ROLE } from '@/enums/user';
import { INotification } from '../notiifcaiton/interface';
import Candidate from '../candidate/model';
import Job from '../job/model';
import { ENUM_JOB_STATUS } from '@/enums/job';

const apply = async (payload: IApplication, userId: string) => {
  const job = await Job.findById(payload.job);
  if (!job) throw new ApiError(httpStatus.NOT_FOUND, "Job offer doesn't exist");

  const company = await Company.findById(job.company);
  if (!company)
    throw new ApiError(httpStatus.NOT_FOUND, "Company doesn't exist anymore");

  const candidate = await Candidate.findOne({ id: userId });
  if (!candidate)
    throw new ApiError(httpStatus.NOT_FOUND, 'Candidate account not exist');

  if (job.status === ENUM_JOB_STATUS.CLOSED)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Job offer is closed');

  const alreadyApplied = await Application.findOne({
    job: payload.job,
    candidate: candidate._id,
  });

  if (alreadyApplied)
    throw new ApiError(httpStatus.NOT_FOUND, 'Already applied for this job');

  payload.candidate = candidate._id;

  const data = await Application.create(payload);

  // Send notification to company
  const notificationPayload: INotification = {
    type: ENUM_NOFICATION_TYPE.APPLY,
    from: {
      _id: candidate._id,
      name: candidate.name,
      role: ENUM_USER_ROLE.CANDIDATE,
    },
    to: { _id: company._id, name: company.name, role: ENUM_USER_ROLE.COMPANY },
    job: job,
  };

  NotificationServices.createNotification(notificationPayload);

  return data;
};

const myApplications = async (userId: string, searchTerm: string) => {
  const candidate = await ApplicationUtils.isCandidateExist(userId);
  if (!candidate)
    throw new ApiError(httpStatus.NOT_FOUND, 'Candidate account not exist');

  const data: IApplicationPopulated[] = await Application.find({
    candidate: candidate._id,
  }).populate({
    path: 'job',
    select: '_id title company industry employmentType location',
    populate: { path: 'company', select: '_id name logo industry location' },
  });

  let filteredData = data;
  if (searchTerm)
    filteredData = data.filter(item => {
      searchTerm = searchTerm?.toLowerCase();
      const jobTitle = item?.job?.title?.toLowerCase();
      const companyName = item?.job?.company?.name?.toLowerCase();

      // @ts-ignore
      return jobTitle.includes(searchTerm) || companyName.includes(searchTerm);
    });

  return filteredData;
};

const updateStatus = async (
  id: string,
  status: ENUM_APPLICATION_STATUS,
  userId: string
) => {
  const application = await Application.findById(id).populate('job');
  if (!application)
    throw new ApiError(httpStatus.NOT_FOUND, "Job application doesn't exist");

  const company = await Company.findOne({ id: userId });
  if (!company)
    throw new ApiError(httpStatus.NOT_FOUND, 'Company account not exist');

  //@ts-ignore
  if (!application.job.company.equals(company._id))
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'This application is not belong to your job'
    );

  if (application.status !== ENUM_APPLICATION_STATUS.PENDING)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Already ${application.status} the application`
    );

  const data = await Application.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
      runValidators: true,
    }
  );

  // Send notification to candidate
  const type =
    status === ENUM_APPLICATION_STATUS.ACCEPTED
      ? ENUM_NOFICATION_TYPE.APPLICATION_ACCEPTED
      : ENUM_NOFICATION_TYPE.APPLICATIN_REJECTED;

  const candidate = await Candidate.findById(application.candidate);
  const job = await Job.findById(application.job);

  if (!candidate || !job)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Candidate/job doesn't exist anymore"
    );

  const notificationPayload: INotification = {
    type,
    from: {
      _id: company._id,
      name: company.name,
      role: ENUM_USER_ROLE.COMPANY,
    },
    to: {
      _id: candidate._id,
      name: candidate.name,
      role: ENUM_USER_ROLE.CANDIDATE,
    },
    job,
  };

  NotificationServices.createNotification(notificationPayload);

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
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "You can't delete this application"
    );

  if (application.status !== ENUM_APPLICATION_STATUS.PENDING)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Application is already ${application.status}`
    );

  const data = await Application.findByIdAndDelete(id);
  return data;
};

export const ApplicaitonServices = {
  apply,
  myApplications,
  updateStatus,
  remove,
};
