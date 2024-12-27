import { NextFunction, Request, Response } from 'express';
import CustomError from '../helpers/customError';
import { verifyToken } from '../token/jwt_token';
import jwt from 'jsonwebtoken';
import { accounts, users } from '../db/schema';

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const bearerToken = req.headers['authorization']?.split(' ');
  if (!bearerToken) return next(new CustomError('authorization header is not provided', 401));

  if (bearerToken[0].toLocaleLowerCase() !== 'bearer') {
    return next(new CustomError('invalid token format', 401));
  }
  const token = bearerToken[1];

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { username: string };
  req.body.username = decodedToken.username;

  next();
}
