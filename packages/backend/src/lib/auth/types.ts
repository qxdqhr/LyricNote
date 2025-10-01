// Better-Auth 扩展类型定义

export interface ExtendedUser {
  id: string
  email: string
  name: string
  image?: string | null
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  // 自定义字段
  username?: string
  nickname?: string
  role: string
  preferences?: any
  twoFactorEnabled?: boolean
}

export interface ExtendedSession {
  user: ExtendedUser
  session: {
    id: string
    userId: string
    expiresAt: Date
    token: string
    ipAddress?: string
    userAgent?: string
  }
}
