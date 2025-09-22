import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/database'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    role: string
  }
}

export async function authenticate(request: NextRequest): Promise<{
  user?: any
  error?: string
}> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: '未提供有效的认证令牌' }
  }

  const token = authHeader.substring(7)

  try {
    // 验证 JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
    
    // 检查会话是否存在且未过期
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            nickname: true,
            role: true,
            avatar: true,
            preferences: true
          }
        }
      }
    })

    if (!session) {
      return { error: '会话不存在或已失效' }
    }

    if (session.expiresAt < new Date()) {
      // 删除过期会话
      await prisma.session.delete({ where: { id: session.id } })
      return { error: '会话已过期' }
    }

    return { user: session.user }

  } catch (error) {
    console.error('Authentication error:', error)
    return { error: '认证失败' }
  }
}

export function requireAuth(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const { user, error } = await authenticate(request)
    
    if (error || !user) {
      return NextResponse.json(
        { error: error || '认证失败' },
        { status: 401 }
      )
    }

    // 将用户信息添加到请求对象
    const authenticatedRequest = request as AuthenticatedRequest
    authenticatedRequest.user = user

    return handler(authenticatedRequest)
  }
}

export function requireRole(roles: string[]) {
  return function (handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
    return async (request: NextRequest) => {
      const { user, error } = await authenticate(request)
      
      if (error || !user) {
        return NextResponse.json(
          { error: error || '认证失败' },
          { status: 401 }
        )
      }

      if (!roles.includes(user.role)) {
        return NextResponse.json(
          { error: '权限不足' },
          { status: 403 }
        )
      }

      // 将用户信息添加到请求对象
      const authenticatedRequest = request as AuthenticatedRequest
      authenticatedRequest.user = user

      return handler(authenticatedRequest)
    }
  }
}

// 可选认证（不强制要求登录）
export async function optionalAuth(request: NextRequest): Promise<{
  user?: any
}> {
  const { user } = await authenticate(request)
  return { user }
}
