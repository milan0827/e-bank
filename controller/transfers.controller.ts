import { NextFunction, Request, Response } from 'express';
import { db } from '../db/drizzle';
import { entries, transfers } from '../db/schema';
import { catchAsynncFunc } from '../helpers/catchAysynFunc';
import CustomError from '../helpers/customError';
import { eq } from 'drizzle-orm';

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
  const { fromAccountId, toAccountId, amount } = req.body;

  if (!fromAccountId || !toAccountId || !amount) {
    next(new CustomError('All fields are required', 400));
  }

  const result = await db.insert(transfers).values({ fromAccountId, toAccountId, amount }).returning();

  res.status(200).json({
    status: 'success',
    message: 'Transferred successfully',
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

export default { getTransfer, createTransfer, getAllTransfer };
