import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import HttpError from './HttpError';

export const requireKey =
  (key?: string) => (req: Request, _: Response, next: NextFunction) => {
    if (!key) {
      next();
      return;
    }

    if (key === req.headers['access-key']) {
      next();
      return;
    }

    next(new HttpError(StatusCodes.FORBIDDEN));
  };
