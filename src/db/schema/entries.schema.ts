import { doublePrecision, index, integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { accounts } from './accounts.schema';
import { sql } from 'drizzle-orm';

export const entries = pgTable(
  'entries',
  {
    id: serial('id').primaryKey(),
    accountId: integer('account_id')
      .notNull()
      .references(() => accounts.id),
    amount: doublePrecision('acmount').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => {
    return {
      accountIdx: index('account_idx').on(table.accountId),
    };
  },
);

sql`COMMENT ON COLUMN ${entries.amount} IS 'can be negative or positive'`;
export type EntryType = typeof entries.$inferSelect;
