import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { unlinkSync } from 'fs';
import { IUploadFile } from '@/interfaces/file';
import path from 'path';
import ApiError from '@/errors/ApiError';
import httpStatus from 'http-status';
import { ENUM_FILE_TYPE } from '@/enums/file';
import config from '@/config';

cloudinary.config({
  cloud_name: config.CLOUDINARY.CLOUD_NAME,
  api_key: config.CLOUDINARY.API_KEY,
  api_secret: config.CLOUDINARY.API_SECRET,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads');
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

const uploadToCloudinary = async (
  file: IUploadFile,
  fileType: ENUM_FILE_TYPE
) => {
  if (!file?.mimetype.includes(fileType)) {
    unlinkSync(file.path);
    throw new ApiError(httpStatus.BAD_REQUEST, `File type must be ${fileType}`);
  }

  const result = await cloudinary.uploader.upload(file.path);

  unlinkSync(file.path);
  return result;
};

export const FileUploader = {
  upload,
  uploadToCloudinary,
};
