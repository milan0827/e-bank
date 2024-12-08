import { NextFunction, Request, Response } from 'express';
import { catchAsynncFunc } from '../../helpers/catchAysynFunc';
import { db } from '../../db/drizzle';
import { accounts, users } from '../../db/schema';
import CustomError from '../../helpers/customError';
import { eq } from 'drizzle-orm';
import { hashedPassword } from '../auth/password';

// NOTE: Only the bank admin can perform thsese action

const createUser = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { username, fullName, password, email } = req.body;

  if (!username || !fullName || !password || !email) return next(new CustomError('all fields are required', 404));

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
  const { username } = req.params;
  if (!username || username === '') {
    return next(new CustomError('Provide a valid username', 400));
  }

  const user = await db.select().from(users).where(eq(users.username, username)).limit(1);

  if (!user || user.length === 0) return next(new CustomError('username already exists', 400));
  res.status(200).json({
    status: 'success',
    user: user[0],
  });
});

const updateUser = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;
  const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);

  if (!existingUser || existingUser.length === 0) return next(new CustomError('Provide valid a username', 400));
  const { email, password, fullName } = req.body;

  const user = await db.update(users).set({ email, password, fullName }).where(eq(users.username, username)).returning();
  if (!user || user.length === 0) return next(new CustomError('Internal server error', 500));

  res.status(200).json({
    status: 'success',
    user: user[0],
  });
});

// TODO: delete user to be done later
const deleteUser = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;
  const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);

  if (!existingUser || existingUser.length === 0) return next(new CustomError('Provide a valid username', 400));

  await db.delete(users).where(eq(users.username, username));

  res.status(200).json({
    status: 'success',
    user: null,
  });
});

export default { createUser, getAllUser, getUser, updateUser, deleteUser };
