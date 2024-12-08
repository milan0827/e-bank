oimport { sql } from 'drizzle-orm';
import { doublePrecision, index, integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { accounts } from './accounts.schema';

export const transfers = pgTable(
  'transfers',
  {
    id: serial('id').primaryKey(),
    fromAccountId: integer('from_account_id')
      .notNull()
      .references(() => accounts.id),
    toAccountId: integer('to_account_id')
      .notNull()
      .references(() => accounts.id),
    amount: doublePrecision('amount').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => {
    return {
      fromAccountIdx: index('from_account_idx').on(table.id),
      toAccountIdx: index('to_account_idx').on(table.id),
    };
  },
);

export type TransferType = typeof transfers.$inferSelect;
sql`COMMENT ON COLUMN ${transfers.amount} IS "Can not be negative"`;
