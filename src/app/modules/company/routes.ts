import { ENUM_USER_ROLE } from '@/enums/user';
import auth from '@middlewares/auth';
import validateRequest from '@middlewares/validateRequest';
import express from 'express';
import { CompanyControllers } from './controller';
import { CompanyValidations } from './validation';
const router = express.Router();

router.get('/', CompanyControllers.getAllCompanies);
router.get('/:id', CompanyControllers.getCompany);

router.patch(
  '/edit-profile',
  auth(ENUM_USER_ROLE.COMPANY),
  validateRequest(CompanyValidations.editProfile),
  CompanyControllers.editProfile
);

export const CompanyRoutes = router;
