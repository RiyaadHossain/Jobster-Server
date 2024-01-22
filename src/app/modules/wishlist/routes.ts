import auth from '@/app/middlewares/auth';
import validateRequest from '@/app/middlewares/validateRequest';
import { ENUM_USER_ROLE } from '@/enums/user';
import express from 'express';
import { WishlistValidations } from './validations';
import { WishlistControllers } from './controller';

const router = express.Router();

router.post(
  '/add',
  auth([ENUM_USER_ROLE.CANDIDATE]),
  validateRequest(WishlistValidations.add),
  WishlistControllers.add
);

router.get(
  '/my-list',
  auth([ENUM_USER_ROLE.CANDIDATE]),
  WishlistControllers.myList
);

router.get(
  '/already-added/:id',
  auth([ENUM_USER_ROLE.CANDIDATE]),
  WishlistControllers.alreadyAdded
);

router.delete(
  '/remove/:id',
  auth([ENUM_USER_ROLE.CANDIDATE]),
  WishlistControllers.remove
);

export const WishlistRoutes = router;
