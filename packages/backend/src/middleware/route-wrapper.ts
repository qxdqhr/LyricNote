import { NextRequest, NextResponse } from 'next/server'
import { withAuth, type AuthLevel, type RouteHandler, type RouteContext } from './auth'
import { withApiErrorHandling } from './error'
import { withLogging, type LoggingOptions } from './logging'

/**
 * 路由配置选项
 */
export interface RouteOptions {
  /** 认证级别 */
  auth?: AuthLevel
  /** 是否启用错误处理（默认 true） */
  errorHandling?: boolean
  /** 日志配置（默认启用基础日志） */
  logging?: boolean | LoggingOptions
}

/**
 * 创建路由处理器
 * 
 * 自动应用认证、错误处理等中间件
 * 
 * @param handler - 业务逻辑处理器
 * @param options - 路由配置选项
 * @returns 完整的路由处理器
 * 
 * @example
 * ```typescript
 * // 需要管理员权限的路由
 * export const GET = createRoute(
 *   async (request, context) => {
 *     const { user } = context // 自动注入，类型安全
 *     
 *     const data = await getConfig()
 *     
 *     return NextResponse.json({ success: true, data })
 *   },
 *   { auth: 'admin' }
 * )
 * 
 * // 不需要认证的公开路由
 * export const POST = createRoute(
 *   async (request, context) => {
 *     const body = await request.json()
 *     // ... 处理逻辑
 *   },
 *   { auth: 'none' }
 * )
 * ```
 */
export function createRoute(
  handler: RouteHandler,
  options: RouteOptions = {}
): (request: NextRequest, context?: any) => Promise<NextResponse> {
  const {
    auth = 'none',
    errorHandling = true,
    logging = true,
  } = options

  // 包装业务逻辑
  let wrappedHandler = handler

  // 1. 应用认证中间件
  if (auth && auth !== 'none') {
    wrappedHandler = withAuth(wrappedHandler, auth)
  }

  // 2. 应用错误处理中间件
  if (errorHandling) {
    wrappedHandler = withApiErrorHandling(wrappedHandler)
  }

  // 3. 应用日志中间件（最外层，确保记录所有请求）
  if (logging) {
    const loggingOptions = typeof logging === 'boolean' ? {} : logging
    wrappedHandler = withLogging(wrappedHandler, loggingOptions)
  }

  // 返回 Next.js 路由处理器
  return async (request: NextRequest, serverContext: any = {}) => {
    const context: RouteContext = {
      params: serverContext.params,
    }

    return wrappedHandler(request, context)
  }
}

/**
 * 快捷方法：创建需要管理员权限的路由
 */
export function createAdminRoute(
  handler: RouteHandler
): (request: NextRequest, context?: any) => Promise<NextResponse> {
  return createRoute(handler, { auth: 'admin' })
}

/**
 * 快捷方法：创建需要超级管理员权限的路由
 */
export function createSuperAdminRoute(
  handler: RouteHandler
): (request: NextRequest, context?: any) => Promise<NextResponse> {
  return createRoute(handler, { auth: 'super_admin' })
}

/**
 * 快捷方法：创建需要用户登录的路由
 */
export function createAuthRoute(
  handler: RouteHandler
): (request: NextRequest, context?: any) => Promise<NextResponse> {
  return createRoute(handler, { auth: 'user' })
}

/**
 * 快捷方法：创建公开路由
 */
export function createPublicRoute(
  handler: RouteHandler
): (request: NextRequest, context?: any) => Promise<NextResponse> {
  return createRoute(handler, { auth: 'none' })
}


