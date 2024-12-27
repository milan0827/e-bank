import { NextFunction, Request, Response } from 'express';
import { catchAsynncFunc } from '../../helpers/catchAysynFunc';
import { db } from '../../db/drizzle';
import { entries } from '../../db/schema';
import { eq } from 'drizzle-orm';
import CustomError from '../../helpers/customError';

const getEntry = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const entry = await db
    .select()
    .from(entries)
    .where(eq(entries.id, Number(id)))
    .limit(1);

  if (!entry || entry.length === 0) {
    return next(new CustomError('Entry with that id could not be found', 400));
  }

  res.status(200).json({
    status: 'success',
    message: 'Entry found',
    entry: entry[0],
  });
});

const createEntry = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { accountId, amount } = req.body;

  if (!accountId || !amount) {
    next(new CustomError('All fields are required', 400));
  }

  const result = await db.insert(entries).values({ accountId, amount: amount }).returning();

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

const getAllEntries = catchAsynncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const result = await db.select().from(entries).orderBy(entries.createdAt);

  if (!result) {
    return next(new CustomError('No entries found', 200));
  }

  res.status(200).json({
    status: 'success',
    message: 'Entries found',
    data: result,
  });
});

export default { getEntry, createEntry, getAllEntries };
