/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { ENUM_USER_ROLE } from '@/enums/user';
import { Types } from 'mongoose';
import { Model } from 'mongoose';
import { ICompany } from '../company/interface';
import { ICandidate } from '../candidate/interface';

export type IUser = {
  payload: import('mongoose').Types.ObjectId;
  id: string;
  email: string;
  password: string;
  role: ENUM_USER_ROLE;
  candidate?: Types.ObjectId;
  company?: Types.ObjectId;
  admin?: Types.ObjectId;
};

export interface UserModel extends Model<IUser> {
  isUserExist(id: string): Promise<IUser> | null;
  isPasswordMatched(givenPass: string, savedPass: string): Promise<boolean>;
  getRoleSpecificDetails(
    id: string
  ): Promise<
    | (ICompany & { _id: Types.ObjectId })
    | (ICandidate & { _id: Types.ObjectId })
    | null
  >;
}
