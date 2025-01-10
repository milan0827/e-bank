import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { ERRORS } from '../../constants';
import { db } from '../../db/drizzle';
import { users } from '../../db/schema';
import { catchAsynncFunc } from '../../helpers/catchAysynFunc';
import CustomError from '../../helpers/customError';
import { hashedPassword } from './password';
import { createToken } from '../../token/jwt_token';

interface User {
  username: string;
  email: string;
  fullName: string;
}

interface UserResponse {
  user: User;
  accessToken: string;
}

const registerUser = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { username, fullName, password, email } = req.body;

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

const login = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  const user = await db.select().from(users).where(eq(users.username, username)).limit(1);
  if (!user.length) return next(new CustomError(ERRORS.AUTH.INVALID_CREDENTIALS, 400));

  const isMatch = await bcrypt.compare(password, user[0].password);
  if (!isMatch) {
    return next(new CustomError(ERRORS.AUTH.INVALID_CREDENTIALS, 400));
  }

  const token = createToken(user[0].username);
  if (!token) {
    return next(new CustomError(ERRORS.AUTH.TOKEN_GENERATION_FAILED, 500));
  }

  const UserResponse: UserResponse = {
    user: {
      username: user[0].fullName,
      email: user[0].email,
      fullName: user[0].fullName,
    },
    accessToken: token,
  };

  res.status(200).json({
    status: 'success',
    user: UserResponse,
  });
});

export default { registerUser, login };
