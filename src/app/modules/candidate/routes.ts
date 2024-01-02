import { ENUM_USER_ROLE } from '@/enums/user';
import auth from '@middlewares/auth';
import validateRequest from '@middlewares/validateRequest';
import express from 'express';
import { CandidateControllers } from './controller';
import { CandidateValidations } from './validation';
const router = express.Router();

router.get('/', CandidateControllers.getAllCandidates);
router.get('/:id', CandidateControllers.getCandidate);

router.patch(
  '/edit-profile',
  auth(ENUM_USER_ROLE.CANDIDATE),
  validateRequest(CandidateValidations.editProfile),
  CandidateControllers.editProfile
);

export const CandidateRoutes = router;
