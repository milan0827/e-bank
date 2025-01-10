import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/drizzle';
import { users, UserType } from '../db/schema';
import CustomError from '../helpers/customError';
import { catchAsynncFunc } from '../helpers/catchAysynFunc';

export const authMiddleware=catchAsynncFunc(async(req: Request, res: Response, next: NextFunction)=> {
  const bearerToken = req.headers['authorization']?.split(' ');
  if (!bearerToken) return next(new CustomError('authorization header is not provided', 401));

  if (bearerToken[0].toLocaleLowerCase() !== 'bearer') {
    return next(new CustomError('invalid token format', 401));
  }
  const token = bearerToken[1];
  if (!token) return next(new CustomError('invalid token', 401));
  console.log('PRoec', process.env.JWT_SECRET_KEY!);

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { username: string };
  const username = decodedToken.username;

  const freshUser = await db.select().from(users).where(eq(users.username, username));
  if (freshUser.length === 0) return next(new CustomError('user does not exist', 401));
  console.log('Fresh Users', freshUser);

  req.user = freshUser[0];
  console.log('req.user', req.user);

  next();
})
