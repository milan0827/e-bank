import { NextFunction, Response, Request } from 'express';
import CustomError from '../../helpers/customError';
import { db } from '../../db/drizzle';
import { users, UserType } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword } from './password';
import { createToken } from '../../token/jwt_token';
import { catchAsynncFunc } from '../../helpers/catchAysynFunc';
import bcrypt from 'bcrypt';

interface User {
  username: string;
  email: string;
  fullName: string;
}

interface UserResponse {
  user: User;
  accessToken: string;
}

export const login = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  if (!username || !password) return next(new CustomError('all fields are required', 400));

  const user = await db.select().from(users).where(eq(users.username, username)).limit(1);
  if (!user.length) return next(new CustomError('invalid credentials', 400));

  const isMatch = await bcrypt.compare(password, user[0].password);
  if (!isMatch) {
    return next(new CustomError('invalid credentials', 400));
  }

  const token = createToken(user[0].username);
  if (!token) {
    return next(new CustomError('token generation failed', 500));
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
