import express from 'express';
import { AuthRoutes } from '@modules/auth/routes';
import { UserRoutes } from '@modules/user/routes';
import { CompanyRoutes } from '@modules/company/routes';
import { CandidateRoutes } from '@modules/candidate/routes';
import { JobRoutes } from '@modules/job/routes';
import { ApplicationRoutes } from '../modules/application/routes';
import { WishlistRoutes } from '../modules/wishlist/routes';

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
  {
    path: '/application',
    routes: ApplicationRoutes,
  },
  {
    path: '/wishlist',
    routes: WishlistRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
