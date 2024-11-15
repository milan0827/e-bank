import { NextFunction, Request, Response } from 'express';
import { CustomErrorType } from '../types/customErrorType';

export const globalErrorHandling = (err: CustomErrorType, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
