import { Types } from 'mongoose';
import { ICandidate } from '../candidate/interface';
import { IJob } from '../job/interface';
import { ICompany } from '../company/interface';

export type IWishlist = {
  candidate: Types.ObjectId;
  job: Types.ObjectId;
};

export type IWishlistPopulated = IWishlist & {
  job: IJob & { company: ICompany };
  candidate: ICandidate;
};
