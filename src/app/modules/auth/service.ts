import ApiError from '@/errors/ApiError';
import { jwtHelpers } from '@/helpers/jwtHelpers';
import config from '@config';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import User from '../user/model';
import { IResetCredential, IUserCredential } from './interface';
import { AuthUtils } from './utils';
import bcrypt from 'bcrypt';

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

const forgetPassword = async (email: string) => {
  // 1. Check User Existence
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Email');

  // 2. Generate JWT token using userId
  const payload = { userId: user.id };
  const token = jwtHelpers.generateToken(
    payload,
    config.JWT.RESET_PASSWORD_SECRET as string,
    config.JWT.RESET_PASSWORD_EXPIRE as string
  );

  // 3. Hash the token
  const hashedToken = await bcrypt.hash(
    token,
    Number(config.BCRYPT_SALT_ROUNDS)
  );

  // 4. Save to DB
  user.resetPasswordToken = hashedToken;
  await user.save();

  // 5. Send reset email to user
  const name = (await User.getRoleSpecificDetails(user.id))?.name || email;
  await AuthUtils.sendResetPasswordEmail(email, token, name);
};

const resetPassword = async (resetCredential: IResetCredential) => {
  const { token, newPassword } = resetCredential;

  if (!token) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Token');

  // 1. Decode the token
  const decoded = jwtHelpers.verifyToken(
    token,
    config.JWT.RESET_PASSWORD_SECRET as string
  );

  // 2. Check user token existence
  const userId = decoded.userId;
  const user = await User.findOne({ id: userId }).select('+resetPasswordToken');
  if (!user?.resetPasswordToken)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Token');

  // 3. Check is token mathced (extra step)
  const tokenMatched = await bcrypt.compare(token, user.resetPasswordToken);
  if (!tokenMatched)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Token');

  user.resetPasswordToken = undefined;

  // 4. Save new password
  user.password = newPassword;
  await user.save();

  // 5. Sent reset confirmation password email
  const name = (await User.getRoleSpecificDetails(user.id))?.name || user.email;
  await AuthUtils.sendConfirmResetPasswordEmail(user.email, name);
};

export const AuthServices = {
  signIn,
  accessToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
