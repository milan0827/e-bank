import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { db } from '../../db/drizzle';
import { accounts, users } from '../../db/schema';
import { catchAsynncFunc } from '../../helpers/catchAysynFunc';
import CustomError from '../../helpers/customError';
import { ERRORS } from '../../constants';

enum currencyEnum {
  NRS = 'NRS',
  USD = 'USD',
  EURO = 'EURO',
}

const getAccount = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const accountExists = await db.select().from(accounts).where(eq(accounts.id, +id)).limit(1);

  if (accountExists[0].owner !== req.user.username) {
    return next(new CustomError(ERRORS.ACCOUNT.ACCOUNT_NOT_FOUND, 401));
  }

  if (!accountExists || accountExists.length === 0) {
    return next(new CustomError(ERRORS.ACCOUNT.ACCOUNT_NOT_FOUND, 400));
  }

  res.status(200).json({
    status: 'success',
    message: 'account found',
    account: accountExists[0],
  });
});

const getAllAccounts = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  //TODO: Only andmin can get all accounts
  const allAccounts = await db.select().from(accounts).where(eq(accounts.owner, req.user.username)).limit(5).orderBy(accounts.id);

  if (!allAccounts || allAccounts.length === 0) {
    return next(new CustomError(ERRORS.ACCOUNT.ACCOUNT_NOT_FOUND, 200));
  }

  res.status(200).json({
    status: 'success',
    message: 'accounts found',
    accounts: allAccounts,
  });
});

const createAccount = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { owner, balance, currency } = req.body;

  if (!owner || typeof owner !== 'string' || owner.trim().length === 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'provide a valid owner name',
    });
  }

  if (!Object.values(currencyEnum).includes(currency as currencyEnum)) {
    return res.status(400).json({
      status: 'fail',
      message: ERRORS.ACCOUNT.CURRENCY_MISMATCH,
    });
  }

  const account = await db
    .insert(accounts)
    .values({
      balance,
      owner,
      currency,
    })
    .returning();

  res.status(200).json({
    status: 'success',
    data: account[0],
  });
});

const updateBalance = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const accountExists = await db.select().from(accounts).where(eq(accounts.id, +id)).limit(1);

  // const freshUser = await db.select().from(users).where(eq(users.username, accountExists[0].owner));
  // if (freshUser.length === 0) return next(new CustomError('user does not exist', 401));
  // console.log('Fresh Users', freshUser);

  // console.log('Account', accountExists);
  // console.log('Account', req.user);

  if (accountExists.length === 0) {
    return next(new CustomError(ERRORS.ACCOUNT.ACCOUNT_NOT_FOUND, 400));
  }

  console.log(accountExists);

  if (accountExists[0].owner !== req.user?.username) {
    return next(new CustomError(ERRORS.AUTH.NOT_AUTHORIZED, 401));
  }

  if (!req.body.balance) {
    return next(new CustomError('the balance field can not be empty', 400));
  }

  const updatedBalanceInfo = await db.update(accounts).set({ balance: req.body.balance }).where(eq(accounts.id, +id)).returning({
    balance: accounts.balance,
  });

  res.status(200).json({
    status: 'success',
    message: 'balance updated successfully',
    data: updatedBalanceInfo[0],
  });
});

const deleteAccount = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  // TODO: Create admin, Only the admin can delete the account after requested by user

  const { id } = req.params;
  const accountExists = await db.select().from(accounts).where(eq(accounts.id, +id)).limit(1);

  if (accountExists.length === 0) {
    return next(new CustomError('account with that id does not exists', 400));
  }

  await db.delete(accounts).where(eq(accounts.id, +id)).returning();

  res.status(200).json({
    status: 'success',
    message: 'Account deleted successfully',
    data: null,
  });
});

export default { getAccount, createAccount, getAllAccounts, updateBalance, deleteAccount };
