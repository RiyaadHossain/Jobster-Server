import validateRequest from '@middlewares/validateRequest';
import express from 'express';
import { UserControllers } from './controller';
import { UserValidations } from './validation';
import auth from '@/app/middlewares/auth';
import { ENUM_USER_ROLE } from '@/enums/user';
import { FileUploader } from '@/helpers/fileUploader';
const router = express.Router();

router.get(
  '/me',
  auth([
    ENUM_USER_ROLE.COMPANY,
    ENUM_USER_ROLE.CANDIDATE,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
  ]),
  UserControllers.me
);

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

router.get(
  '/get-image',
  auth([ENUM_USER_ROLE.COMPANY, ENUM_USER_ROLE.CANDIDATE]),
  UserControllers.getImageUrl
);

export const UserRoutes = router;
