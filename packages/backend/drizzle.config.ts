import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

// 解析 DATABASE_URL 或使用单独的环境变量
function getDatabaseCredentials() {
  const databaseUrl = process.env.DATABASE_URL
  
  if (databaseUrl) {
    // 从 DATABASE_URL 解析
    const url = new URL(databaseUrl)
    return {
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1), // 移除开头的 '/'
      ssl: false,
    }
  }
  
  // 使用单独的环境变量
  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5433,
    user: process.env.DB_USER || 'lyricnote_dev',
    password: process.env.DB_PASSWORD || 'dev_password_123',
    database: process.env.DB_NAME || 'lyricnote_dev',
    ssl: false,
  }
}

export default defineConfig({
  dialect: 'postgresql',
  out: './drizzle/migrations',
  schema: './drizzle/migrations/schema.ts',
  dbCredentials: getDatabaseCredentials(),
  verbose: true,
  strict: true,
})
