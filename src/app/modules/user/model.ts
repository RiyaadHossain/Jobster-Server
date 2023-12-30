/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, Types, model } from 'mongoose';
import { IUser, UserModel } from './interface';
import { ENUM_USER_ROLE } from '../../../enums/user';
import config from '../../../config';

const userSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ENUM_USER_ROLE, required: true },
    password: { type: String, required: true, select: 0 },
    candidate: { type: Types.ObjectId, ref: 'Candidate' },
    company: { type: Types.ObjectId, ref: 'Company' },
    admin: { type: Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

// Hash Password
userSchema.pre('save', async function () {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.BCRYPT_SALT_ROUNDS)
  );
});

// To check User Existence
userSchema.statics.isUserExist = async function (id: string) {
  const isUserExist = await User.findOne(
    { id },
    { id: 1, password: 1, role: 1 }
  );

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

const User = model<IUser, UserModel>('User', userSchema);

export default User;
