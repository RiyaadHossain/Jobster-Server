import { Schema } from "mongoose";

export type IApplication = {
  job: Schema.Types.ObjectId;
  candidate: Schema.Types.ObjectId;
};
