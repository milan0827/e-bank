import { NextFunction, Request, Response } from 'express';

const catchAsynncFunc = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export { catchAsynncFunc };
