import { ENUM_APPLICATION_STATUS } from '@/enums/application';
import { Types } from 'mongoose';

export type IApplication = {
  job: Types.ObjectId;
  candidate: Types.ObjectId;
  status: ENUM_APPLICATION_STATUS;
  createdAt: Date
};
