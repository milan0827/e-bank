import { NextFunction, Request, Response } from 'express';
import { db } from '../../db/drizzle';
import { accounts, currencyEnum, entries, transfers, users } from '../../db/schema';
import { catchAsynncFunc } from '../../helpers/catchAysynFunc';
import CustomError from '../../helpers/customError';
import { eq } from 'drizzle-orm';
import { transferTX } from './transaction.contoller';
import { CreateTransferParams } from '../../types/transfers';
import accountsController from '../accounts/accounts.controller';

// TODO: getOneUserTranser

const getOneAccountTransfers = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { accountId } = req.params;
  if (!accountId || +accountId <= 0) {
    return next(new CustomError('provide a valid username', 400));
  }
  const transferResult = await db
    .select({
      id: transfers.id,
      fromAccountId: transfers.fromAccountId,
      toAccountId: transfers.toAccountId,
      amount: transfers.amount,
      createdAt: transfers.createdAt,
    })
    .from(transfers)
    .innerJoin(accounts, eq(transfers.fromAccountId, +accountId));

  if (!transferResult) {
    return next(new CustomError('transfer nod done yet', 400));
  }

  res.status(200).json({
    status: 'success',
    message: 'list of transfer records',
    numResults: transferResult.length,
    data: transferResult,
  });
});

const getTransfer = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const transfer = await db
    .select()
    .from(transfers)
    .where(eq(transfers.id, Number(id)))
    .orderBy(transfers.createdAt);

  if (!transfer || transfer.length === 0) {
    return next(new CustomError('No transfer records', 200));
  }

  res.status(200).json({
    status: 'success',
    message: 'Transfer record found',
    transfer: transfer[0],
  });
});

const createTransfer = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { fromAccountId, toAccountId, amount, currency }: CreateTransferParams = req.body;

  const account = await db.select().from(accounts).where(eq(accounts.id, fromAccountId));

  if (account[0].owner !== req.body.username) {
    return next(new CustomError('not authorized', 401));
  }

  if (amount < 100 || account[0].balance < amount) {
    return next(new CustomError('insufficient balance', 400));
  }

  if ((await validAccountCurrency(currency, toAccountId)) === false || (await validAccountCurrency(currency, fromAccountId)) === false) {
    return next(new CustomError('account currency mismatch', 400));
  }

  const transfer = await transferTX({ amount: Number(amount), toAccountId, fromAccountId } as CreateTransferParams);

  if (!transfer) return next(new CustomError('internal server error', 500));

  res.status(200).json({
    status: 'success',
    message: 'transaction done successfully',
    transfers: transfer,
  });
});

const getAllTransfer = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  // TODO: Only admin can access this api
  const result = await db.select().from(transfers).orderBy(transfers.createdAt);

  if (!result) {
    return next(new CustomError('no transfer records', 200));
  }

  res.status(200).json({
    status: 'success',
    messag: 'transfer records found',
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

export default { getTransfer, createTransfer, getAllTransfer, getOneAccountTransfers };
