import { Request, Response } from 'express';
import { db } from '../db/drizzle';
import { accounts } from '../db/schema';
import { eq } from 'drizzle-orm';

enum currencyEnum {
  NRS = 'NRS',
  USD = 'USD',
  EURO = 'EURO',
}

const getAccount = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log('Id', id);
  try {
    const result = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, Number(id)))
      .limit(1);

    if (result.length === 0) {
      throw new Error('Account with that id could not be found');
    }

    res.status(200).json({
      status: 'success',
      message: 'User found',
      account: { ...result[0] },
    });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const getAllAccounts = async (req: Request, res: Response) => {
  try {
    const result = await db.select().from(accounts).limit(5).offset(1).orderBy(accounts.id);

    if (!result) {
      throw new Error('No accounts found');
    }

    res.status(200).json({
      status: 'success',
      message: 'Accounts found',
      accounts: result,
    });
  } catch (error) {
    const err = error as Error;
    res.status(204).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const createAccount = async (req: Request, res: Response) => {
  const { fullName, balance, currency } = req.body;

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Full name is required',
    });
  }

  if (!Object.values(currencyEnum).includes(currency)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Currency',
    });
  }

  try {
    console.log(req.body);
    const result = await db.insert(accounts).values({
      balance,
      fullName,
      currency,
    });

    res.status(200).json({
      status: 'success',
      account: result,
    });
  } catch (error) {
    const err = error as Error;
    console.log('err', err);
    res.status(404).json({
      status: 'fail',
      error: err.message,
    });
  }
};

const updateBalance = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const accountExists = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, Number(id)))
      .limit(1);

    console.log('Account exists', accountExists);
    if (accountExists.length === 0) {
      throw new Error('Account with that id does not exists');
    }

    const updatedBalanceInfo = await db
      .update(accounts)
      .set({ balance: req.body.balance })
      .where(eq(accounts.id, Number(id)))
      .returning({
        balance: accounts.balance,
      });

    console.log('Updated', updatedBalanceInfo);

    res.status(200).json({
      status: 'success',
      message: 'Balance updated successfully',
      account: { ...updatedBalanceInfo[0] },
    });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const deleteAccount = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const accountExists = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, Number(id)))
      .limit(1);

    if (accountExists.length === 0) {
      throw new Error('Account with that id does not exists');
    }

    await db
      .delete(accounts)
      .where(eq(accounts.id, Number(id)))
      .returning();

    res.status(200).json({
      status: 'success',
      message: 'Account deleted successfully',
      accounts: null,
    });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export default { getAccount, createAccount, getAllAccounts, updateBalance, deleteAccount };
