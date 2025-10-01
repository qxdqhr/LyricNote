import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  out: './drizzle/migrations',
  schema: './src/lib/drizzle/schema.ts',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5433,
    user: process.env.DB_USER || 'lyricnote_dev',
    password: process.env.DB_PASSWORD || 'dev_password_123',
    database: process.env.DB_NAME || 'lyricnote_dev',
    ssl: false,
  },
  verbose: true,
  strict: true,
})
