import { Request, Response } from 'express';
import { db } from '../db/drizzle';
import { accounts } from '../db/schema';
const getAccount = async (req: Request, res: Response) => {
  res.json({
    acc: 'Hello world',
  });
};

const createAccount = async (req: Request, res: Response) => {
  try {
    const result = await db.insert(accounts).values(req.body);

    res.status(200).json({
      status: 'success',
      account: result,
    });
  } catch (error) {
    const err = error as Error;

    res.status(404).json({
      status: 'fail',
      error: err,
    });
  }
};

export default { getAccount, createAccount };
