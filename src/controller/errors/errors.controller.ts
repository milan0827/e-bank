import { Request, Response } from 'express';
import { CustomErrorType } from '../../types/customErrorType';
import Logger from '../../lib/logger';

export const globalErrorHandling = (err: CustomErrorType, req: Request, res: Response) => {
  Logger.error('error error error error', err);

  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  if (err.code === '23505' || err.code === '23503') {
    //23505 => Duplicate key value error code
    // 23503 => foreign key constraint // creating an account of user that does not exist on database
    return res.status(403).json({
      status: 'fail',
      message: err.message,
    });
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
