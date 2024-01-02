import express from 'express';
import { AuthRoutes } from '@modules/auth/routes';
import { UserRoutes } from '@modules/user/routes';
import { CompanyRoutes } from '@modules/company/routes';
import { CandidateRoutes } from '@modules/candidate/routes';
import { JobRoutes } from '@modules/job/routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    routes: AuthRoutes,
  },
  {
    path: '/user',
    routes: UserRoutes,
  },
  {
    path: '/company',
    routes: CompanyRoutes,
  },
  {
    path: '/candidate',
    routes: CandidateRoutes,
  },
  {
    path: '/job',
    routes: JobRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
