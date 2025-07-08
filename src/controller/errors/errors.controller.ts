import { Request, Response } from 'express';
import { CustomErrorType } from '../../types/customErrorType';
import CustomError from '../../helpers/customError';

const productionError = (err: CustomErrorType, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const developmentError = (err: CustomErrorType, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
    stack: err.stack,
  });
};

export const globalErrorHandling = (err: CustomErrorType, req: Request, res: Response) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;
  console.log(err.name, 'error name');
  console.log(err.code, 'error code');

  if (process.env.NODE_ENV === 'production') {
    if (err.name === 'TokenExpiredError') err = new CustomError('token expired', 401);

    if (err.name === 'JsonWebTokenError') {
      err = new CustomError('invalid token', 400);
    }

    if (err.code === '23505' || err.code === '23503') {
      //23505 => Duplicate key value error code
      // 23503 => foreign key constraint // creating an account of user that does not exist on database
      return res.status(403).json({
        status: 'fail',
        message: err.message,
      });
    }

    console.log('Error in Production 💣');
    productionError(err, res);
  }

  if (process.env.NODE_ENV === 'development') {
    developmentError(err, res);
  }
};
