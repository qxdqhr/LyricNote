import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../../../drizzle/migrations/schema'
import * as relations from '../../../drizzle/migrations/relations'

// 从 DATABASE_URL 解析连接信息，或使用单独的环境变量
function getDatabaseConfig() {
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

// 创建数据库连接池
const pool = new Pool(getDatabaseConfig())

// 合并 schema 和 relations
const fullSchema = { ...schema, ...relations }

// 创建 Drizzle 数据库实例
export const db = drizzle(pool, { schema: fullSchema })

// 导出 schema 以便在其他地方使用
export { schema, relations }

// 导出类型
export type Database = typeof db
