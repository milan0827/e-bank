import { NextFunction, Request, Response } from 'express';
import { catchAsynncFunc } from '../../helpers/catchAysynFunc';
import { db } from '../../db/drizzle';
import { accounts, users } from '../../db/schema';
import CustomError from '../../helpers/customError';
import { eq } from 'drizzle-orm';
import { hashedPassword } from '../auth/password';

const createUser = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { username, fullName, password, email } = req.body;

  if (!username || !fullName || !password || !email) return next(new CustomError('all fields are required', 404));

  console.log(req.body);

  if (username !== username.toLowerCase()) {
    return next(new CustomError('username must be in lowercase', 400));
  }

  const hashPassword = await hashedPassword(password);

  const user = await db
    .insert(users)
    .values({
      email,
      fullName,
      password: hashPassword,
      username,
    })
    .returning();

  res.status(200).json({
    status: 'success',
    user: user[0],
  });
});

const getAllUser = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const allUser = await db.select().from(users).limit(10);

  if (!allUser || allUser.length === 0) {
    return next(new CustomError('no records found', 200));
  }

  res.status(200).json({
    status: 'success',
    users: allUser,
  });
});

const getUser = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const username = req.params.username;
  if (!username || username === '') {
    return next(new CustomError('Provide a username', 400));
  }

  const user = await db.select().from(users).where(eq(users.username, username)).limit(1);

  if (!user || user.length === 0) return next(new CustomError('user with that username does not exists', 400));
  res.status(200).json({
    status: 'success',
    user: user[0],
  });
});

export default { createUser, getAllUser, getUser };
