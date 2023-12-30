import express from 'express';
import { AuthRoutes } from '../modules/auth/routes';
import { UserRoutes } from '../modules/user/routes';

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
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
