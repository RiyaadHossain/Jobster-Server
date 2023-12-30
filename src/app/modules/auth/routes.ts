import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidations } from './validation';
import { AuthControllers } from './controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const router = express.Router();

router.post(
  '/sign-in',
  validateRequest(AuthValidations.signIn),
  AuthControllers.signIn
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidations.signIn),
  AuthControllers.refreshToken
);

router.post(
  '/change-password',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.COMPANY,
    ENUM_USER_ROLE.CANDIDATE
  ),
  validateRequest(AuthValidations.changePassword),
  AuthControllers.changePassword
);

export const AuthRoutes = router;
