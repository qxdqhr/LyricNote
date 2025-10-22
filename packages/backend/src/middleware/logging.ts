/**
 * 日志中间件
 * Logging Middleware
 *
 * 自动记录 API 请求日志，包括请求信息、响应状态、耗时等
 */

import { NextRequest, NextResponse } from 'next/server';
import type { RouteHandler, RouteContext } from './auth';
import { apiLogger } from '../lib/logger';

export interface LoggingOptions {
  /** 是否记录请求体（默认false，避免记录敏感信息） */
  logBody?: boolean;
  /** 是否记录响应体（默认false） */
  logResponse?: boolean;
  /** 是否记录查询参数（默认true） */
  logQuery?: boolean;
  /** 慢请求阈值（ms），超过此值会警告（默认1000ms） */
  slowThreshold?: number;
  /** 是否启用（默认true） */
  enabled?: boolean;
}

/**
 * 日志中间件
 *
 * 自动记录 API 请求的详细信息
 *
 * @param handler - 路由处理器
 * @param options - 日志配置选项
 * @returns 包装后的处理器
 *
 * @example
 * ```typescript
 * export const GET = createRoute(
 *   async (request, context) => {
 *     // 业务逻辑
 *   },
 *   {
 *     logging: {
 *       logQuery: true,
 *       slowThreshold: 500
 *     }
 *   }
 * )
 * ```
 */
export function withLogging(handler: RouteHandler, options: LoggingOptions = {}): RouteHandler {
  const {
    logBody = false,
    logResponse = false,
    logQuery = true,
    slowThreshold = 1000, // 1秒
    enabled = true,
  } = options;

  // 如果禁用，直接返回原处理器
  if (!enabled) {
    return handler;
  }

  return async (request: NextRequest, context: RouteContext) => {
    const startTime = Date.now();
    const method = request.method;
    const url = request.url;
    const path = new URL(url).pathname;

    // 提取请求信息
    const requestInfo: Record<string, any> = {
      method,
      path,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent')?.substring(0, 100) || 'unknown',
    };

    // 记录用户信息（如果有）
    if (context.user) {
      requestInfo.userId = context.user.id;
      requestInfo.userRole = context.user.role;
    }

    // 记录查询参数
    if (logQuery) {
      const searchParams = new URL(url).searchParams;
      if (searchParams.toString()) {
        requestInfo.query = Object.fromEntries(searchParams);
      }
    }

    // 记录请求体（谨慎使用）
    if (logBody && ['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        // 克隆请求以避免消费body
        const clonedRequest = request.clone();
        const body = await clonedRequest.json();

        // 过滤敏感字段
        const filteredBody = filterSensitiveData(body);
        requestInfo.body = filteredBody;
      } catch {
        // body不是JSON或为空
        requestInfo.body = '[non-json body]';
      }
    }

    // 记录请求开始
    apiLogger.debug(`→ ${method} ${path}`, requestInfo);

    try {
      // 执行实际的处理器
      const response = await handler(request, context);

      const duration = Date.now() - startTime;
      const status = response.status;

      // 记录响应信息
      const responseInfo: Record<string, any> = {
        ...requestInfo,
        status,
        duration: `${duration}ms`,
      };

      // 记录响应体（谨慎使用）
      if (logResponse) {
        try {
          const clonedResponse = response.clone();
          const body = await clonedResponse.json();
          responseInfo.response = body;
        } catch {
          // 响应不是JSON
          responseInfo.response = '[non-json response]';
        }
      }

      // 根据耗时和状态码选择日志级别
      if (duration > slowThreshold) {
        apiLogger.warn(`⚠️ ${method} ${path} - Slow request (${duration}ms)`, responseInfo);
      } else if (status >= 500) {
        apiLogger.error(
          `❌ ${method} ${path} - Server error (${status}, ${duration}ms)`,
          responseInfo
        );
      } else if (status >= 400) {
        apiLogger.warn(
          `⚠️ ${method} ${path} - Client error (${status}, ${duration}ms)`,
          responseInfo
        );
      } else {
        apiLogger.info(`✓ ${method} ${path} - Success (${status}, ${duration}ms)`, responseInfo);
      }

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;

      // 记录错误信息
      const errorInfo = {
        ...requestInfo,
        duration: `${duration}ms`,
        errorMessage: error instanceof Error ? error.message : String(error),
      };

      // 记录错误
      apiLogger.error(`❌ ${method} ${path} - Exception (${duration}ms)`, errorInfo);

      // 继续抛出错误，让错误处理中间件处理
      throw error;
    }
  };
}

/**
 * 过滤敏感数据
 *
 * 防止记录密码、token等敏感信息到日志中
 */
function filterSensitiveData(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sensitiveKeys = [
    'password',
    'token',
    'secret',
    'apiKey',
    'api_key',
    'accessToken',
    'access_token',
    'refreshToken',
    'refresh_token',
    'authorization',
    'cookie',
    'session',
  ];

  const filtered: any = Array.isArray(data) ? [] : {};

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();

    // 检查是否为敏感字段
    if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive))) {
      filtered[key] = '[FILTERED]';
    } else if (value && typeof value === 'object') {
      // 递归过滤嵌套对象
      filtered[key] = filterSensitiveData(value);
    } else {
      filtered[key] = value;
    }
  }

  return filtered;
}

/**
 * 快捷方法：创建启用详细日志的中间件
 */
export function withVerboseLogging(handler: RouteHandler): RouteHandler {
  return withLogging(handler, {
    logQuery: true,
    logBody: true,
    logResponse: true,
    slowThreshold: 500,
  });
}

/**
 * 快捷方法：创建仅记录慢请求的中间件
 */
export function withSlowRequestLogging(
  handler: RouteHandler,
  threshold: number = 1000
): RouteHandler {
  return withLogging(handler, {
    slowThreshold: threshold,
    logQuery: false,
    logBody: false,
    logResponse: false,
  });
}
