import { ENUM_USER_ROLE } from '@/enums/user';
import auth from '@middlewares/auth';
import validateRequest from '@middlewares/validateRequest';
import express from 'express';
import { CompanyControllers } from './controller';
import { CompanyValidations } from './validation';
const router = express.Router();

router.get('/', CompanyControllers.getAllCompanies);

router.patch(
  '/edit-profile',
  auth([ENUM_USER_ROLE.COMPANY]),
  validateRequest(CompanyValidations.editProfile),
  CompanyControllers.editProfile
);

router.get(
  '/my-jobs',
  auth([ENUM_USER_ROLE.COMPANY]),
  CompanyControllers.myJobs
);

router.get(
  '/applied-candidates',
  auth([ENUM_USER_ROLE.COMPANY]),
  CompanyControllers.appliedCandidates
);

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
  CompanyControllers.getCompany
);

export const CompanyRoutes = router;
