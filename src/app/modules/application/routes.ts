import express from 'express';
import { ApplicationValidations } from './validation';
import validateRequest from '@/app/middlewares/validateRequest';
import auth from '@/app/middlewares/auth';
import { ENUM_USER_ROLE } from '@/enums/user';
import { ApplicationControllers } from './controller';

const router = express.Router();

router.post(
  '/apply',
  auth([ENUM_USER_ROLE.CANDIDATE]),
  validateRequest(ApplicationValidations.apply),
  ApplicationControllers.apply
);

router.get(
  '/my-applications',
  auth([ENUM_USER_ROLE.CANDIDATE]),
  ApplicationControllers.myApplications
);

router.patch(
  '/update-status/:id',
  auth([ENUM_USER_ROLE.COMPANY]),
  validateRequest(ApplicationValidations.updateStatus),
  ApplicationControllers.updateStatus
);

router.delete(
  '/remove/:id',
  auth([ENUM_USER_ROLE.CANDIDATE]),
  ApplicationControllers.remove
);

export const ApplicationRoutes = router;
