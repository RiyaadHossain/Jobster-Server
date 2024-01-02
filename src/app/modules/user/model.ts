/* eslint-disable @typescript-eslint/no-this-alias */
import { ENUM_USER_ROLE } from '@/enums/user';
import config from '@config';
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './interface';

const userSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ENUM_USER_ROLE, required: true },
    password: {
      type: String,
      minlength: 6,
      maxlength: 32,
      required: true,
      select: 0,
    },
    candidate: { type: Schema.Types.ObjectId, ref: 'Candidate' },
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
    admin: { type: Schema.Types.ObjectId, ref: 'Admin' },
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

const User = model<IUser, UserModel>('User', userSchema);

export default User;
