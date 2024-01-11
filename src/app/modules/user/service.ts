import { ENUM_USER_ACCOUNT_STATUS, ENUM_USER_ROLE } from '@/enums/user';
import ApiError from '@/errors/ApiError';
import httpStatus from 'http-status';
import Candidate from '../candidate/model';
import Company from '../company/model';
import { IUser } from './interface';
import User from './model';
import { UserUtils } from './utils';
import { IUploadFile } from '@/interfaces/file';
import { FileUploader } from '@/helpers/fileUploader';
import { ENUM_FILE_TYPE } from '@/enums/file';
import { imageFields } from './constant';

const signUp = async (payload: IUser, name: string, URL: string) => {
  // 1. Is user exist
  const isExist = await User.findOne({
    email: payload.email,
    status: ENUM_USER_ACCOUNT_STATUS.ACTIVE,
  });
  if (isExist)
    throw new ApiError(httpStatus.BAD_REQUEST, 'User account is already exist');

  // 2. Delete inactivated user with same email
  await User.deleteOne({ email: payload.email });

  // 3. Generate userId and hash password
  const id = await UserUtils.generateId(payload.role);
  payload.id = id;

  const user = await User.create(payload);

  if (!user)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user account');

  // 4. Send Confirmation Email to User
  const email = user.email;
  const token = user.generateToken();
  await UserUtils.sendConfirmationEmail({ email, token, name, URL });

  // 5. Finally Save user doc
  await user.save();

  return user;
};

const confirmAccount = async (name: string, token: string) => {
  // 1. Check user existence
  const user = await User.findOne({ confirmationToken: token });
  if (!user)
    throw new ApiError(httpStatus.NOT_FOUND, "User account doesn't exist");

  // 2. Check Token Expire Date
  const expired = new Date() > (user.confirmationTokenExpires as Date);
  if (expired) throw new ApiError(httpStatus.NOT_FOUND, 'User Token Expired!');

  // 3. Create Candidate/Company account
  const userInfo = { id: user.id, name };
  if (user.role === ENUM_USER_ROLE.CANDIDATE) {
    const candidate = await Candidate.create(userInfo);
    if (!candidate)
      throw new ApiError(
        httpStatus.FAILED_DEPENDENCY,
        'Failed to create candidate account'
      );
    user.candidate = candidate._id;
  }

  if (user.role === ENUM_USER_ROLE.COMPANY) {
    const company = await Company.create(userInfo);
    if (!company)
      throw new ApiError(
        httpStatus.FAILED_DEPENDENCY,
        'Failed to create company account'
      );
    user.company = company._id;
  }

  // 4. Update User Info
  user.status = ENUM_USER_ACCOUNT_STATUS.ACTIVE;
  user.confirmationToken = undefined;
  user.confirmationTokenExpires = undefined;

  await user.save();

  return user;
};

const uploadImage = async (
  userId: string,
  filedName: string,
  file: IUploadFile
) => {
  if (!imageFields.includes(filedName))
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Field name must be avatar/logo/banner'
    );

  // 1. Check user account
  const user = await User.findOne({ id: userId });
  if (!user)
    throw new ApiError(httpStatus.NOT_FOUND, "User account doesn't exist!");

  // 2. Upload Image
  const uploadImage = await FileUploader.uploadToCloudinary(
    file,
    ENUM_FILE_TYPE.PNG
  );

  // 3. Save image url
  if (user.role === ENUM_USER_ROLE.CANDIDATE)
    await Candidate.findOneAndUpdate(
      { id: userId },
      { [filedName]: uploadImage.secure_url }
    );
  else
    await Company.findOneAndUpdate(
      { id: userId },
      { [filedName]: uploadImage.secure_url }
    );
};

export const UserServices = { signUp, confirmAccount, uploadImage };
