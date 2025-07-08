import { NextFunction, Request, Response } from 'express';

export const trimmer = (req: Request, res: Response, next: NextFunction) => {
  for (const [key, value] of Object.entries(req.body)) {
    if (typeof value === 'string') {
      req.body[key] = value.trim();
    }
  }

  next();
};
