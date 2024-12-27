import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { ERRORS } from '../../constants';
import { db } from '../../db/drizzle';
import { users } from '../../db/schema';
import { catchAsynncFunc } from '../../helpers/catchAysynFunc';
import CustomError from '../../helpers/customError';

// NOTE: Only the bank admin can perform thsese action

const getAllUser = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const allUser = await db.select().from(users).limit(10);

  if (!allUser || allUser.length === 0) {
    return next(new CustomError(ERRORS.USER.USER_NOT_FOUND, 404));
  }

  res.status(200).json({
    status: 'success',
    users: allUser,
  });
});

const getUser = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;
  if (!username || username === '') {
    return next(new CustomError(ERRORS.USER.USER_NOT_FOUND, 400));
  }

  const user = await db.select().from(users).where(eq(users.username, username)).limit(1);

  if (!user || user.length === 0) return next(new CustomError(ERRORS.USER.USERNAME_EXISTS, 400));
  res.status(200).json({
    status: 'success',
    user: user[0],
  });
});

const updateUser = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;
  const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);

  if (!existingUser || existingUser.length === 0) return next(new CustomError(ERRORS.USER.USER_NOT_FOUND, 400));
  const { email, password, fullName } = req.body;

  const user = await db.update(users).set({ email, password, fullName }).where(eq(users.username, username)).returning();
  if (!user || user.length === 0) return next(new CustomError(ERRORS.GENERAL.INTERNAL_SERVER_ERROR, 500));

  res.status(200).json({
    status: 'success',
    user: user[0],
  });
});

// TODO: delete user to be done later
const deleteUser = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;
  const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);

  if (!existingUser || existingUser.length === 0) return next(new CustomError(ERRORS.USER.USER_NOT_FOUND, 400));

  await db.delete(users).where(eq(users.username, username));

  res.status(200).json({
    status: 'success',
    user: null,
  });
});

export default { getAllUser, getUser, updateUser, deleteUser };
