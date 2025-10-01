// Better-Auth 已被自定义 Drizzle 认证系统替代
// 请使用 DrizzleAuthService 进行认证操作

export { DrizzleAuthService as auth } from './drizzle-auth'
export * from './drizzle-auth'

// 导出类型
export type Session = {
  id: string
  userId: string
  token: string
  expiresAt: string
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: string
  updatedAt: string
}