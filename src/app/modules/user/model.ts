/* eslint-disable @typescript-eslint/no-this-alias */
import { ENUM_USER_ACCOUNT_STATUS, ENUM_USER_ROLE } from '@/enums/user';
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import { IUser, IUserMethods, UserModel } from './interface';
import Candidate from '../candidate/model';
import Company from '../company/model';
import crypto from 'crypto';

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: { type: String, enum: Object.values(ENUM_USER_ROLE), required: true },
    candidate: { type: Schema.Types.ObjectId, ref: 'Candidate' },
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
    admin: { type: Schema.Types.ObjectId, ref: 'Admin' },
    status: {
      type: String,
      enum: Object.values(ENUM_USER_ACCOUNT_STATUS),
      default: ENUM_USER_ACCOUNT_STATUS.IN_ACTIVE,
    },
    confirmationToken: { type: String },
    confirmationTokenExpires: { type: Date },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);


// To check User Existence
userSchema.statics.isUserExist = async function (id: string) {
  const isUserExist = await User.findOne({ id });
  return isUserExist;
};

// To check User Password
userSchema.statics.isPasswordMatched = async function (
  givenPass: string,
  savedPass: string
) {
  const isPassMatched = await bcrypt.compare(givenPass, savedPass);

  return isPassMatched;
};

// To Get Role Specific user details
userSchema.statics.getRoleSpecificDetails = async function (id: string) {
  let user = await User.findOne({ id });

  if (user?.role === ENUM_USER_ROLE.CANDIDATE)
    user = await Candidate.findOne({ id: id });

  if (user?.role === ENUM_USER_ROLE.COMPANY)
    user = await Company.findOne({ id: id });

  return user;
};

// To Generate Token
userSchema.methods.generateToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  const user = this;
  user.confirmationToken = token;

  const date = new Date();
  const expireDate = new Date(date.setDate(date.getDate() + 1));

  user.confirmationTokenExpires = expireDate;
  return token;
};

const User = model<IUser, UserModel>('User', userSchema);

export default User;
