import { NextRequest, NextResponse } from 'next/server';

/**
 * 添加 CORS 响应头
 *
 * 注意：
 * 1. 当请求使用 credentials 时，不能使用通配符 '*'
 * 2. 必须明确指定允许的 origin
 * 3. 需要设置 Access-Control-Allow-Credentials: true
 *
 * @param response - Next.js 响应对象
 * @param request - Next.js 请求对象
 * @returns 添加了 CORS 头的响应对象
 */
export function addCorsHeaders(response: NextResponse, request: NextRequest): NextResponse {
  const origin = request.headers.get('origin') || '';

  // 允许的源列表（开发环境）
  const allowedOrigins = [
    'http://localhost:8081', // 移动端开发服务器
    'http://localhost:3000', // Web 后台
    'http://127.0.0.1:8081',
    'http://127.0.0.1:3000',
  ];

  // 生产环境从环境变量读取
  if (process.env.NODE_ENV === 'production') {
    const productionOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    allowedOrigins.push(...productionOrigins);
  }

  // 检查请求的 origin 是否在允许列表中
  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    response.headers.set('Access-Control-Max-Age', '86400'); // 24小时缓存预检结果
  }

  return response;
}

/**
 * 创建 OPTIONS 预检请求处理器
 *
 * @param request - Next.js 请求对象
 * @returns CORS 预检响应
 */
export function handleCorsPreFlight(request: NextRequest): NextResponse {
  const response = new NextResponse(null, { status: 204 });
  return addCorsHeaders(response, request);
}
