import validateRequest from '@middlewares/validateRequest';
import express from 'express';
import { UserControllers } from './controller';
import { UserValidations } from './validation';
import auth from '@/app/middlewares/auth';
import { ENUM_USER_ROLE } from '@/enums/user';
import { FileUploader } from '@/helpers/fileUploader';
const router = express.Router();

router.post(
  '/sign-up',
  validateRequest(UserValidations.signUp),
  UserControllers.signUp
);

router.get('/confirm-account/:name/:token', UserControllers.confirmAccount);

router.post(
  '/upload-image',
  auth([ENUM_USER_ROLE.COMPANY, ENUM_USER_ROLE.CANDIDATE]),
  FileUploader.upload.single('image'),
  UserControllers.uploadImage
);

export const UserRoutes = router;
