import { doublePrecision, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  username: varchar('username').primaryKey(),
  fullName: varchar('full_name').notNull(),
  hashePassword: varchar('hashed_password').notNull(),
  passwordChangedAt: timestamp('password_changed_at', { withTimezone: true }).default(new Date('0001-01-01T00:00:00Z')),
  email: varchar('email').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
