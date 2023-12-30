import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './validation';
import { UserControllers } from './controller';
const router = express.Router();

router.post(
  '/sign-up',
  validateRequest(UserValidations.signUp),
  UserControllers.signUp
);


export const UserRoutes = router;
