import { NextFunction, Request, Response } from 'express';
import { db } from '../db/drizzle';
import { accounts, currencyEnum, entries, transfers } from '../db/schema';
import { catchAsynncFunc } from '../helpers/catchAysynFunc';
import CustomError from '../helpers/customError';
import { eq } from 'drizzle-orm';
import { transferTX } from './transaction.contoller';
import { CreateTransferParams } from '../types/transfers';
import accountsController from './accounts.controller';

const getTransfer = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await db
    .select()
    .from(transfers)
    .where(eq(transfers.id, Number(id)))
    .orderBy(entries.createdAt);

  if (!result) {
    return next(new CustomError('No transfer records', 200));
  }

  res.status(200).json({
    status: 'success',
    message: 'Transfer records found',
    data: { ...result },
  });
});

const createTransfer = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { fromAccountId, toAccountId, amount, currency }: CreateTransferParams = req.body;

  if (fromAccountId <= 0 || toAccountId <= 0 || !amount) {
    return next(new CustomError('All fields are required', 400));
  }

  if (toAccountId === fromAccountId) {
    return next(new CustomError('Can not transfer to own account', 400));
  }

  const account = await db.select().from(accounts).where(eq(accounts.id, fromAccountId));

  if (amount < 100 || account[0].balance < amount) {
    return next(new CustomError('Insufficient balance', 400));
  }

  if (!fromAccountId || !toAccountId) {
    return next(new CustomError('Missing accounts', 400));
  }

  if ((await validAccountCurrency(currency, toAccountId)) === false || (await validAccountCurrency(currency, fromAccountId)) === false) {
    return next(new CustomError('account currency mismatch', 400));
  }

  const result = await transferTX({ amount: Number(amount), toAccountId, fromAccountId } as CreateTransferParams);

  if (!result) return next(new CustomError('Internal server error', 500));

  res.status(200).json({
    status: 'success',
    message: 'Transaction done successfully',
    data: result,
  });
});

const getAllTransfer = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const result = await db.select().from(transfers).orderBy(transfers.createdAt);

  if (!result) {
    return next(new CustomError('No transfer records', 200));
  }

  res.status(200).json({
    status: 'success',
    messag: 'Transfer records found',
    data: result,
  });
});

const validAccountCurrency = async (currency: CreateTransferParams['currency'], accountId: number): Promise<boolean> => {
  const account = await db.select().from(accounts).where(eq(accounts.id, accountId));
  if (!account || account[0].id <= 0) {
    return false;
  }

  if (currency !== account[0].currency) {
    return false;
  }
  return true;
};

export default { getTransfer, createTransfer, getAllTransfer };
