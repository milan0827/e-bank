import { eq, sql } from 'drizzle-orm';
import { db } from '../db/drizzle';
import { accounts, AccountType, entries, EntryType, transfers, TransferType } from '../db/schema';
import { CreateTransferParams } from '../types/transfers';

interface TransferTxResult {
  transfer: TransferType[];
  fromEntry: EntryType[];
  toEntry: EntryType[];
  amount: number;
  fromAccount: AccountType[];
  toAccount: AccountType[];
}

// Working of transfer money
export const transferTX = async (arg: CreateTransferParams): Promise<TransferTxResult> => {
  const tranxResult: TransferTxResult = {
    amount: arg.amount,
    fromAccount: [],
    toAccount: [],
    fromEntry: [],
    toEntry: [],
    transfer: [],
  };

  await db.transaction(async (tsx) => {
    const fromAccountBalance = await tsx.select({ balance: accounts.balance }).from(accounts).where(eq(accounts.id, arg.fromAccountId)).limit(1);

    // First create transfer by inserting into transfers table
    tranxResult.transfer = await tsx
      .insert(transfers)
      .values({ amount: arg.amount, fromAccountId: arg.fromAccountId, toAccountId: arg.toAccountId })
      .returning();

    // Since the money is transferred from fromAccount, we create fromEntry to save the transfer records, since the money is transferred it will be -arg.amount
    tranxResult.fromEntry = await tsx.insert(entries).values({ accountId: arg.fromAccountId, amount: -arg.amount }).returning();

    // Transferred money will be transferrd to account toAccount, so we also create entries for toAccount
    tranxResult.toEntry = await tsx.insert(entries).values({ accountId: arg.toAccountId, amount: arg.amount }).returning();

    // After creating the entries we update the from account by subtracting totalBalance with transferred balance
    tranxResult.fromAccount = await tsx
      .update(accounts)
      .set({ balance: sql`${accounts.balance}::numeric - ${arg.amount}::numeric` })
      .where(eq(accounts.id, arg.fromAccountId))
      .returning();

    // After creating the entries we update the from account by adding totalBalance with transferred balance
    tranxResult.toAccount = await tsx
      .update(accounts)
      .set({ balance: sql`${accounts.balance}::numeric + ${arg.amount}::numeric` })
      .where(eq(accounts.id, arg.toAccountId))
      .returning();
  });

  return tranxResult;
};
