import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('Failed connecting database');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
export const db = drizzle({ client: pool, casing: 'snake_case' });
