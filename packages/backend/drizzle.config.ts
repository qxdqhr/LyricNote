import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new Error('数据库URL未在环境变量中设置');
}

export default defineConfig({
  dialect: 'postgresql',
  out: './drizzle/migrations',
  schema: './drizzle/migrations/schema.ts',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
  verbose: true,
  strict: true,
});
