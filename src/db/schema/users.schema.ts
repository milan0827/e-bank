import { doublePrecision, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  username: varchar('username').primaryKey(),
  fullName: varchar('full_name').notNull(),
  password: varchar('password').notNull(),
  passwordChangedAt: timestamp('password_changed_at', { withTimezone: true }).default(new Date('0001-01-01T00:00:00Z')),
  email: varchar('email').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type UserType = typeof users.$inferInsert;
