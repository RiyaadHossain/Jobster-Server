/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { ENUM_EMPLOYMENT_TYPE, ENUM_WORK_LEVEL } from '@/enums/job';
import { Model, Types } from 'mongoose';

export type IJob = {
  title: string;
  category: string;
  company: Types.ObjectId;
  banner: string;
  description: string;
  experience: string;
  workLevel: ENUM_WORK_LEVEL;
  employmentType: ENUM_EMPLOYMENT_TYPE;
  salaryRange: string;
  skills: string[];
  requirements: string[];
  responsibilities: string[];
};

export interface JobModel extends Model<IJob> {
  isJobExist: (id: string) => Promise<IJob | null>;
  isJobCreator: (jobId: string, companyId: Types.ObjectId) => Promise<boolean>;
}
