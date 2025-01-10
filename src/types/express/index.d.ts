import { UserType } from '../db/schema';

declare global {
  namespace Express {
    interface Request {
      user: UserType;
    }
  }
}
