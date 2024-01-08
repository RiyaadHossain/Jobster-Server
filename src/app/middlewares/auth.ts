import config from '@/config';
import ApiError from '@/errors/ApiError';
import { jwtHelpers } from '@/helpers/jwtHelpers';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';

const auth =
  (requiredRoles: string[], optional?: boolean) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // If optional auth route
      if (optional) {
        next();
        return;
      }

      // Authenticate user access
      const token = req.headers.authorization as string;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }

      // verify token
      let verifiedUser = null;
      verifiedUser = jwtHelpers.verifyToken(token, config.JWT.SECRET as Secret);

      req.user = verifiedUser; // role  , userId

      // Authorize user access
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
