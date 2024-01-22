import { ENUM_APPLICATION_STATUS } from '@/enums/application';
import { Types } from 'mongoose';
import { ICompany } from '../company/interface';
import { IJob } from '../job/interface';
import { ICandidate } from '../candidate/interface';

export type IApplication = {
  job: Types.ObjectId;
  candidate: Types.ObjectId;
  status: ENUM_APPLICATION_STATUS;
  createdAt: Date;
};

export type IApplicationPopulated = IApplication & {
  job: IJob & { company: ICompany };
} & { candidate: ICandidate };
