import { Schema, model } from 'mongoose';
import { IApplication } from './interface';
import { ENUM_APPLICATION_STATUS } from '@/enums/application';

const applicationSchema = new Schema<IApplication>(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    candidate: {
      type: Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ENUM_APPLICATION_STATUS),
      default: ENUM_APPLICATION_STATUS.PENDING,
    },
  },
  { timestamps: true }
);

const Application = model<IApplication>('Application', applicationSchema);

export default Application;
