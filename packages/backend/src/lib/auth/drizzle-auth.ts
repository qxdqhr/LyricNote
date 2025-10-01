import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../drizzle/db'
import { user, session } from '../../../drizzle/migrations/schema'
import { eq, and, gt } from 'drizzle-orm'
import { randomBytes } from 'crypto'

// JWT 配置
const JWT_SECRET = process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET || 'fallback-secret'
const JWT_EXPIRES_IN = '7d'

// 用户认证服务
export class DrizzleAuthService {
  // 用户注册
  static async signUp(email: string, password: string, username?: string, role: 'USER' | 'ADMIN' | 'SUPER_ADMIN' = 'USER') {
    try {
      // 检查用户是否已存在
      const existingUser = await db.select().from(user).where(eq(user.email, email)).limit(1)
      if (existingUser.length > 0) {
        throw new Error('用户已存在')
      }

      // 哈希密码
      const hashedPassword = await bcrypt.hash(password, 12)

      // 创建用户
      const [newUser] = await db.insert(user).values({
        id: randomBytes(16).toString('hex'),
        email,
        password: hashedPassword,
        username: username || email.split('@')[0],
        role,
        emailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }).returning()

      // 生成 JWT token
      const token = jwt.sign(
        { 
          userId: newUser.id, 
          email: newUser.email, 
          role: newUser.role 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      )

      // 创建会话
      await this.createSession(newUser.id, token)

      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          role: newUser.role,
        },
        token,
      }
    } catch (error) {
      throw error
    }
  }

  // 用户登录
  static async signIn(email: string, password: string) {
    try {
      // 查找用户
      const [foundUser] = await db.select().from(user).where(eq(user.email, email)).limit(1)
      if (!foundUser) {
        throw new Error('邮箱或密码错误')
      }

      // 验证密码
      if (!foundUser.password) {
        throw new Error('用户密码未设置')
      }

      const isPasswordValid = await bcrypt.compare(password, foundUser.password)
      if (!isPasswordValid) {
        throw new Error('邮箱或密码错误')
      }

      // 生成 JWT token
      const token = jwt.sign(
        { 
          userId: foundUser.id, 
          email: foundUser.email, 
          role: foundUser.role 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      )

      // 创建会话
      await this.createSession(foundUser.id, token)

      return {
        user: {
          id: foundUser.id,
          email: foundUser.email,
          username: foundUser.username,
          role: foundUser.role,
        },
        token,
      }
    } catch (error) {
      throw error
    }
  }

  // 验证 token
  static async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      
      // 检查会话是否存在且未过期
      const [foundSession] = await db.select().from(session)
        .where(and(
          eq(session.token, token),
          gt(session.expiresAt, new Date().toISOString())
        ))
        .limit(1)

      if (!foundSession) {
        throw new Error('会话无效或已过期')
      }

      // 获取用户信息
      const [foundUser] = await db.select().from(user).where(eq(user.id, decoded.userId)).limit(1)
      if (!foundUser) {
        throw new Error('用户不存在')
      }

      return {
        user: {
          id: foundUser.id,
          email: foundUser.email,
          username: foundUser.username,
          role: foundUser.role,
        },
        session: foundSession,
      }
    } catch (error) {
      throw error
    }
  }

  // 创建会话
  static async createSession(userId: string, token: string) {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7天后过期

    await db.insert(session).values({
      id: randomBytes(16).toString('hex'),
      userId,
      token,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  // 删除会话（登出）
  static async signOut(token: string) {
    try {
      await db.delete(session).where(eq(session.token, token))
      return { success: true }
    } catch (error) {
      throw error
    }
  }

  // 获取会话
  static async getSession(token: string) {
    try {
      const result = await this.verifyToken(token)
      return result
    } catch (error) {
      return null
    }
  }

  // 检查管理员权限
  static async requireAdmin(token: string) {
    const result = await this.verifyToken(token)
    if (!['ADMIN', 'SUPER_ADMIN'].includes(result.user.role)) {
      throw new Error('需要管理员权限')
    }
    return result
  }
}

// 中间件辅助函数
export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // 也可以从 cookie 中获取
  const cookieHeader = request.headers.get('Cookie')
  if (cookieHeader) {
    const match = cookieHeader.match(/auth-token=([^;]+)/)
    if (match) {
      return match[1]
    }
  }
  
  return null
}
