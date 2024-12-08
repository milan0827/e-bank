import { NextFunction, Request, Response } from 'express';
import { db } from '../../db/drizzle';
import { accounts, AccountType } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { catchAsynncFunc } from '../../helpers/catchAysynFunc';
import CustomError from '../../helpers/customError';

enum currencyEnum {
  NRS = 'NRS',
  USD = 'USD',
  EURO = 'EURO',
}

const getAccount = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const accountExists = await db.select().from(accounts).where(eq(accounts.id, +id)).limit(1);

  if (!accountExists || accountExists.length === 0) {
    return next(new CustomError('Account with that id does not exists', 400));
  }

  res.status(200).json({
    status: 'success',
    message: 'Account found',
    account: accountExists[0],
  });
});

const getAllAccounts = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const allAccounts = await db.select().from(accounts).limit(5).orderBy(accounts.id);

  if (!allAccounts) {
    return next(new CustomError('No account found', 200));
  }

  res.status(200).json({
    status: 'success',
    message: 'Accounts found',
    accounts: allAccounts,
  });
});

const createAccount = catchAsynncFunc(async (req: Request, res: Response) => {
  const { owner, balance, currency }: AccountType = req.body;

  if (!owner || typeof owner !== 'string' || owner.trim().length === 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Full name is required',
    });
  }

  if (!Object.values(currencyEnum).includes(currency as currencyEnum)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Currency',
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

  console.log('result', account);

  res.status(200).json({
    status: 'success',
    data: account[0],
  });
});

const updateBalance = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const accountExists = await db.select().from(accounts).where(eq(accounts.id, +id)).limit(1);

  if (accountExists.length === 0) {
    return next(new CustomError('Account with that id does not exists', 400));
  }

  if (!req.body.balance) {
    return next(new CustomError('The balance field can not be field', 400));
  }

  const updatedBalanceInfo = await db.update(accounts).set({ balance: req.body.balance }).where(eq(accounts.id, +id)).returning({
    balance: accounts.balance,
  });

  console.log('Updated', updatedBalanceInfo);

  res.status(200).json({
    status: 'success',
    message: 'Balance updated successfully',
    data: updatedBalanceInfo[0],
  });
});

const deleteAccount = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const accountExists = await db.select().from(accounts).where(eq(accounts.id, +id)).limit(1);

  if (accountExists.length === 0) {
    return next(new CustomError('Account with that id does not exists', 400));
  }

  await db.delete(accounts).where(eq(accounts.id, +id)).returning();

  res.status(200).json({
    status: 'success',
    message: 'Account deleted successfully',
    data: null,
  });
});

export default { getAccount, createAccount, getAllAccounts, updateBalance, deleteAccount };
