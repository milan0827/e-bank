import { index, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './columns.helper';

export const accounts = pgTable(
  'accounts',
  {
    id: serial('id').primaryKey(),
    fullName: varchar('full_name').notNull(),
    balance: varchar('balance').notNull(),
    currency: varchar('currency').notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      fullNameIdx: index('full_name_idx').on(table.fullName),
    };
  },
);

export type AccountType = typeof accounts.$inferSelect;
