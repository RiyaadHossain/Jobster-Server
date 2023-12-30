/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Model, Types } from 'mongoose';
import { ENUM_USER_ROLE } from '../../../enums/user';

export type IUser = {
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
}
