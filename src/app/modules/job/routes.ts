import auth from '@/app/middlewares/auth';
import validateRequest from '@/app/middlewares/validateRequest';
import { ENUM_USER_ROLE } from '@/enums/user';
import express from 'express';
import { JobValidations } from './validation';
import { JobControllers } from './controller';
const router = express.Router();

router.post(
  '/',
  auth([ENUM_USER_ROLE.COMPANY]),
  validateRequest(JobValidations.createJob),
  JobControllers.createJob
);

router.get('/', JobControllers.getAllJobs);

router.get(
  '/:id',
  auth(
    [
      ENUM_USER_ROLE.CANDIDATE,
      ENUM_USER_ROLE.COMPANY,
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
    ],
    true
  ),
  JobControllers.getJob
);

router.patch(
  '/:id',
  auth([ENUM_USER_ROLE.COMPANY]),
  validateRequest(JobValidations.updateJob),
  JobControllers.updateJob
);

router.delete('/:id', auth([ENUM_USER_ROLE.COMPANY]), JobControllers.deleteJob);

export const JobRoutes = router;
