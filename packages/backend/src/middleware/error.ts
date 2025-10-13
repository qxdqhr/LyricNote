import { NextRequest, NextResponse } from 'next/server'
import type { RouteHandler, RouteContext } from './auth'
import { logger } from '../lib/logger'

/**
 * 错误处理中间件
 * 
 * 统一处理路由中的错误，返回标准格式的错误响应
 * 
 * @param handler - 路由处理器
 * @returns 包装后的处理器
 * 
 * @example
 * ```typescript
 * export const GET = withErrorHandling(
 *   async (request, context) => {
 *     // 任何抛出的错误都会被自动捕获并返回标准格式
 *     throw new Error('Something went wrong')
 *   }
 * )
 * ```
 */
export function withErrorHandling(
  handler: RouteHandler
): RouteHandler {
  return async (request: NextRequest, context: RouteContext) => {
    try {
      return await handler(request, context)
    } catch (error) {
      logger.error('Route error', error instanceof Error ? error : new Error(String(error)))

      // 开发环境返回详细错误信息
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json(
          {
            success: false,
            error: error instanceof Error ? error.message : '服务器错误',
            details: error instanceof Error ? {
              message: error.message,
              stack: error.stack,
            } : undefined,
          },
          { status: 500 }
        )
      }

      // 生产环境返回通用错误
      return NextResponse.json(
        {
          success: false,
          error: '服务器错误，请稍后重试',
        },
        { status: 500 }
      )
    }
  }
}

/**
 * API 错误类
 * 
 * 用于在业务逻辑中抛出带有状态码的错误
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * 增强的错误处理中间件
 * 支持 ApiError 类型的错误
 */
export function withApiErrorHandling(
  handler: RouteHandler
): RouteHandler {
  return async (request: NextRequest, context: RouteContext) => {
    try {
      return await handler(request, context)
    } catch (error) {
      logger.error('API route error', error instanceof Error ? error : new Error(String(error)))

      // 处理 ApiError
      if (error instanceof ApiError) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            code: error.code,
          },
          { status: error.statusCode }
        )
      }

      // 开发环境返回详细错误
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json(
          {
            success: false,
            error: error instanceof Error ? error.message : '服务器错误',
            stack: error instanceof Error ? error.stack : undefined,
          },
          { status: 500 }
        )
      }

      // 生产环境返回通用错误
      return NextResponse.json(
        {
          success: false,
          error: '服务器错误，请稍后重试',
        },
        { status: 500 }
      )
    }
  }
}

