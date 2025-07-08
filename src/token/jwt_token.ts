import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import CustomError from '../helpers/customError';
import { AuthPayload } from '../types/auth';

const JWT_SECRET_KEY_LENGTH = 32;

export function createToken(username: string): string {
  if (process.env.JWT_SECRET_KEY!.length < JWT_SECRET_KEY_LENGTH) {
    throw new Error('secret key length must be of 32 characters');
  }

  return jwt.sign({ username }, process.env.JWT_SECRET_KEY!, {
    expiresIn: '5m',
  });
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const bearerToken = req.header('Authorization');
  if (!bearerToken) return next(new CustomError('token verification failed', 401));

  try {
    const token = bearerToken?.split(' ')[1];
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET_KEY!) as { username: string };
    req.user.username = decoded.username;
    next();
  } catch (error) {
    return next(new CustomError('invalid token', 401));
  }
}
