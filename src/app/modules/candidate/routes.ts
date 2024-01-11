import { ENUM_USER_ROLE } from '@/enums/user';
import auth from '@middlewares/auth';
import validateRequest from '@middlewares/validateRequest';
import express from 'express';
import { CandidateControllers } from './controller';
import { CandidateValidations } from './validation';
import { FileUploader } from '@/helpers/fileUploader';
const router = express.Router();

router.get('/', CandidateControllers.getAllCandidates);
router.get(
  '/:id',
  auth(
    [
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.COMPANY,
      ENUM_USER_ROLE.CANDIDATE,
    ],
    true
  ),
  CandidateControllers.getCandidate
);

router.patch(
  '/edit-profile',
  auth([ENUM_USER_ROLE.CANDIDATE]),
  validateRequest(CandidateValidations.editProfile),
  CandidateControllers.editProfile
);

router.post(
  '/upload-resume',
  auth([ENUM_USER_ROLE.CANDIDATE]),
  FileUploader.upload.single('resume'),
  CandidateControllers.uploadResume
);

export const CandidateRoutes = router;
