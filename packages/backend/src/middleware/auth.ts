import { NextRequest, NextResponse } from 'next/server'
import { DrizzleAuthService, getTokenFromRequest } from '@/lib/auth/drizzle-auth'
import { authLogger } from '../lib/logger'

/**
 * 认证级别
 */
export type AuthLevel = 'none' | 'user' | 'admin' | 'super_admin'

/**
 * 路由处理器类型
 */
export type RouteHandler = (
  request: NextRequest,
  context: RouteContext
) => Promise<NextResponse>

/**
 * 路由上下文
 */
export interface RouteContext {
  user?: {
    id: string
    email: string
    username: string
    role: string
  }
  session?: {
    expiresAt: string
  }
  params?: any
}

/**
 * 认证中间件
 * 
 * @param handler - 路由处理器
 * @param level - 认证级别
 * @returns 包装后的处理器
 * 
 * @example
 * ```typescript
 * export const GET = withAuth(
 *   async (request, context) => {
 *     const { user } = context // 自动注入用户信息
 *     // ... 业务逻辑
 *   },
 *   'admin' // 需要管理员权限
 * )
 * ```
 */
export function withAuth(
  handler: RouteHandler,
  level: AuthLevel = 'user'
): RouteHandler {
  return async (request: NextRequest, context: RouteContext) => {
    // 不需要认证，直接执行
    if (level === 'none') {
      return await handler(request, context)
    }

    try {
      // 获取 token
      const token = getTokenFromRequest(request)
      
      if (!token) {
        return NextResponse.json(
          { 
            success: false,
            error: '未提供认证令牌' 
          },
          { status: 401 }
        )
      }

      // 验证 token 并获取用户信息
      const result = await DrizzleAuthService.verifyToken(token)

      // 检查权限级别
      if (level === 'admin' || level === 'super_admin') {
        if (!['ADMIN', 'SUPER_ADMIN'].includes(result.user.role)) {
          return NextResponse.json(
            { 
              success: false,
              error: '需要管理员权限' 
            },
            { status: 403 }
          )
        }
      }

      if (level === 'super_admin') {
        if (result.user.role !== 'SUPER_ADMIN') {
          return NextResponse.json(
            { 
              success: false,
              error: '需要超级管理员权限' 
            },
            { status: 403 }
          )
        }
      }

      // 注入用户信息到 context
      context.user = result.user
      context.session = result.session

      // 执行业务逻辑
      return await handler(request, context)
    } catch (error) {
      authLogger.error('Auth middleware error', error instanceof Error ? error : new Error(String(error)))
      return NextResponse.json(
        { 
          success: false,
          error: '认证失败' 
        },
        { status: 401 }
      )
    }
  }
}

/**
 * 快捷方法：需要用户登录
 */
export const requireAuth = (handler: RouteHandler) => withAuth(handler, 'user')

/**
 * 快捷方法：需要管理员权限
 */
export const requireAdmin = (handler: RouteHandler) => withAuth(handler, 'admin')

/**
 * 快捷方法：需要超级管理员权限
 */
export const requireSuperAdmin = (handler: RouteHandler) => withAuth(handler, 'super_admin')

