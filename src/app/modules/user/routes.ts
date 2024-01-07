import validateRequest from '@middlewares/validateRequest';
import express from 'express';
import { UserControllers } from './controller';
import { UserValidations } from './validation';
const router = express.Router();

router.post(
  '/sign-up',
  validateRequest(UserValidations.signUp),
  UserControllers.signUp
);

router.get('/confirm-account/:name/:token', UserControllers.confirmAccount);

export const UserRoutes = router;
