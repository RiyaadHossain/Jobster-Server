import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IUserCredential } from './interface';
import User from '../user/model';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { Secret } from 'jsonwebtoken';

const signIn = async (payload: IUserCredential) => {
  const { email, password } = payload;

  // Check User Existence
  const userExist = await User.findOne({ email });
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
    config.JWT.EXPIRES_IN as string
  );

  const refreshToken = jwtHelpers.generateToken(
    { userId, role },
    config.JWT.REFRESH_SECRET as Secret,
    config.JWT.REFRESH_EXPIRES_IN as string
  );

  return { accessToken, refreshToken };
};

const refreshToken = async (token: string) => {
  // Refresh Token Verificaiton
  const decoded = jwtHelpers.verifyToken(
    token,
    config.JWT.REFRESH_SECRET as Secret
  );

  const { userId, role } = decoded;

  // Check User Existence
  const userExist = await User.isUserExist(userId);
  if (!userExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User doesn't exist!");
  }

  const accessToken = jwtHelpers.generateToken(
    { userId, role },
    config.JWT.SECRET as Secret,
    config.JWT.EXPIRES_IN as string
  );

  return { accessToken };
};

const changePassword = async (payload: IUserCredential) => {
  const { id, oldPassword, newPassword } = payload;

  // Check User Existence
  const userExist = await User.findOne({ id }).select('+password');
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

export const AuthServices = { signIn, refreshToken, changePassword };
