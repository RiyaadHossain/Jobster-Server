import { ENUM_USER_ROLE } from '@/enums/user';
import auth from '@middlewares/auth';
import validateRequest from '@middlewares/validateRequest';
import express from 'express';
import { AuthControllers } from './controller';
import { AuthValidations } from './validation';
const router = express.Router();

router.post(
  '/sign-in',
  validateRequest(AuthValidations.signIn),
  AuthControllers.signIn
);

router.post(
  '/access-token',
  validateRequest(AuthValidations.accessToken),
  AuthControllers.accessToken
);

router.post(
  '/change-password',
  auth([
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.COMPANY,
    ENUM_USER_ROLE.CANDIDATE,
  ]),
  validateRequest(AuthValidations.changePassword),
  AuthControllers.changePassword
);

router.post(
  '/forget-password',
  validateRequest(AuthValidations.forgetPassword),
  AuthControllers.forgetPassword
);

router.post(
  '/reset-password',
  validateRequest(AuthValidations.resetPassword),
  AuthControllers.resetPassword
);

export const AuthRoutes = router;
