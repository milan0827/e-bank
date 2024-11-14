import { doublePrecision, index, pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const currencyEnum = pgEnum('currency_enum', ['NRS', 'EURO', 'USD']);

export const accounts = pgTable(
  'accounts',
  {
    id: serial('id').primaryKey(),
    fullName: varchar('full_name').notNull(),
    balance: doublePrecision('balance').notNull(),
    currency: currencyEnum('currency').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      fullNameIdx: index('full_name_idx').on(table.fullName),
    };
  },
);

export type AccountType = typeof accounts.$inferSelect;
