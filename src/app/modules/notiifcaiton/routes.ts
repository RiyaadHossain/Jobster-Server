import auth from '@/app/middlewares/auth';
import { ENUM_USER_ROLE } from '@/enums/user';
import express from 'express';
import { NotificationControllers } from './controller';
const router = express.Router();

router.get(
  '/',
  auth([ENUM_USER_ROLE.COMPANY, ENUM_USER_ROLE.CANDIDATE]),
  NotificationControllers.getAllNotifications
);

router.patch(
  '/read-all',
  auth([ENUM_USER_ROLE.COMPANY, ENUM_USER_ROLE.CANDIDATE]),
  NotificationControllers.readAllNotifications
);

router.delete(
  '/',
  auth([ENUM_USER_ROLE.COMPANY, ENUM_USER_ROLE.CANDIDATE]),
  NotificationControllers.deleteAllNotifications
);

router.delete(
  '/:id',
  auth([ENUM_USER_ROLE.COMPANY, ENUM_USER_ROLE.CANDIDATE]),
  NotificationControllers.deleteNotification
);

export const NotificationRoutes = router;
