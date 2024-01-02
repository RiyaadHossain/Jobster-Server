import { Schema, model } from 'mongoose';
import { IApplication } from './interface';

const applicationSchema = new Schema<IApplication>(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    candidate: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

const Application = model<IApplication>('Application', applicationSchema);

export default Application;
