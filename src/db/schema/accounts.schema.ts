import { doublePrecision, index, pgEnum, pgTable, serial, timestamp, unique, varchar } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { uniqueIndex } from 'drizzle-orm/mysql-core';

export const currencyEnum = pgEnum('currency_enum', ['NRS', 'EURO', 'USD']);

export const accounts = pgTable(
  'accounts',
  {
    id: serial('id').primaryKey(),
    owner: varchar('owner')
      .notNull()
      .references(() => users.username),
    balance: doublePrecision('balance').notNull(),
    currency: currencyEnum('currency').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      ownerIdx: index('owner_idx').on(table.owner),
      ownerCurrencyKey: unique('owner_currency_key').on(table.owner, table.currency),
    };
  },
);

export type AccountType = typeof accounts.$inferSelect;
