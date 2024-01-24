/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import {
  ENUM_EMPLOYMENT_TYPE,
  ENUM_JOB_STATUS,
  ENUM_WORK_LEVEL,
} from '@/enums/job';
import { Model, Types } from 'mongoose';

export type IJob = {
  title: string;
  industry: string;
  company: Types.ObjectId;
  location: string;
  description: string;
  experience: string;
  status: ENUM_JOB_STATUS;
  workLevel: ENUM_WORK_LEVEL;
  employmentType: ENUM_EMPLOYMENT_TYPE;
  salaryRange: string;
  skills: { title: string }[];
  requirements: { title: string }[];
  responsibilities: { title: string }[];
};

export interface JobModel extends Model<IJob> {
  isJobExist: (id: string) => Promise<IJob | null>;
  isJobCreator: (jobId: string, companyId: Types.ObjectId) => Promise<boolean>;
}

export type IJobFilter = {
  title?: string;
  workLevel?: string;
  employmentType?: string;
  location?: string;
  industry?: string;
};

export type IJobQuery = {
  company: Types.ObjectId;
  title?: { [key: string]: string };
};
