import express from 'express';
import { DashboardControllers } from './controller';
import auth from '@/app/middlewares/auth';
import { ENUM_USER_ROLE } from '@/enums/user';

const router = express.Router();

router.get(
  '/overview',
  auth([
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.CANDIDATE,
    ENUM_USER_ROLE.COMPANY,
  ]),
  DashboardControllers.overview
);

router.get(
  '/stat/profile-view',
  auth([ENUM_USER_ROLE.CANDIDATE, ENUM_USER_ROLE.COMPANY]),
  DashboardControllers.profileViewStat
);

router.get(
  '/stat/application',
  auth([ENUM_USER_ROLE.CANDIDATE, ENUM_USER_ROLE.COMPANY]),
  DashboardControllers.applicationStat
);

export const DashboardRoutes = router;
