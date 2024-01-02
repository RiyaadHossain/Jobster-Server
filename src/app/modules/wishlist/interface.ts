import { Types } from 'mongoose';

export type IWishlist = {
  candidate: Types.ObjectId;
  job: Types.ObjectId;
};
