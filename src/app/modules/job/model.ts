import { Schema, Types, model } from 'mongoose';
import {
  ENUM_WORK_LEVEL,
  ENUM_EMPLOYMENT_TYPE,
  ENUM_JOB_STATUS,
} from '@/enums/job';
import { IJob, JobModel } from './interface';

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, unique: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    location: { type: String },
    industry: { type: String, required: true },
    description: { type: String, required: true },
    salaryRange: { type: String, required: true },
    experience: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(ENUM_JOB_STATUS),
      default: ENUM_JOB_STATUS.PUBLISHED,
    },
    workLevel: {
      type: String,
      enum: Object.values(ENUM_WORK_LEVEL),
      required: true,
    },
    employmentType: {
      type: String,
      enum: Object.values(ENUM_EMPLOYMENT_TYPE),
      required: true,
    },
    skills: [{ title: { type: String } }],
    requirements: [{ title: { type: String } }],
    responsibilities: [{ title: { type: String } }],
  },
  { timestamps: true }
);

jobSchema.statics.isJobExist = async function (id: string) {
  const isExist = await Job.findById(id);
  return isExist;
};

jobSchema.statics.isJobCreator = async function (
  jobId: string,
  companyId: Types.ObjectId
) {
  const job = await Job.findById(jobId);
  return job?.company.equals(companyId);
};

const Job = model<IJob, JobModel>('Job', jobSchema);

export default Job;
