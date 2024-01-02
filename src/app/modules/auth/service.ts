import ApiError from '@/errors/ApiError';
import { jwtHelpers } from '@/helpers/jwtHelpers';
import config from '@config';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import User from '../user/model';
import { IUserCredential } from './interface';

const signIn = async (payload: IUserCredential) => {
  const { email, password } = payload;

  // Check User Existence
  const userExist = await User.findOne({ email }).select('+password');
  if (!userExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User doesn't exist!");
  }

  // Check Password
  const isPassMatched = await User.isPasswordMatched(
    password,
    userExist.password
  );
  if (!isPassMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
  }

  const { id: userId, role } = userExist;

  // Generate Tokens
  const accessToken = jwtHelpers.generateToken(
    { userId, role },
    config.JWT.SECRET as Secret,
    config.JWT.SECRET_EXPIRE as string
  );

  const refreshToken = jwtHelpers.generateToken(
    { userId, role },
    config.JWT.REFRESH as Secret,
    config.JWT.REFRESH_EXPIRE as string
  );

  return { accessToken, refreshToken };
};

const accessToken = async (token: string) => {
  // Refresh Token Verificaiton
  const decoded = jwtHelpers.verifyToken(token, config.JWT.REFRESH as Secret);

  const { userId, role } = decoded;

  // Check User Existence
  const userExist = await User.isUserExist(userId);
  if (!userExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User doesn't exist!");
  }

  const accessToken = jwtHelpers.generateToken(
    { userId, role },
    config.JWT.SECRET as Secret,
    config.JWT.SECRET_EXPIRE as string
  );

  return { accessToken };
};

const changePassword = async (payload: IUserCredential, userId: string) => {
  const { oldPassword, newPassword } = payload;

  // Check User Existence
  const userExist = await User.findOne({ id: userId }).select('+password');
  if (!userExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User doesn't exist!");
  }

  // Check Password
  const isPassMatched = await User.isPasswordMatched(
    oldPassword as string,
    userExist.password
  );
  if (!isPassMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
  }

  userExist.password = newPassword as string;
  await userExist.save();
};

export const AuthServices = { signIn, accessToken, changePassword };
