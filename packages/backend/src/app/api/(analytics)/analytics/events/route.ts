/**
 * 埋点事件上报接口
 * Analytics Events Endpoint
 *
 * 使用从 shared 包导入的处理器
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyticsHandlers } from '@/lib/analytics';

export const runtime = 'nodejs';

/**
 * POST /api/analytics/events
 * 接收并存储埋点事件
 */
export async function POST(request: NextRequest) {
  return analyticsHandlers.handleEventsPost(request);
}

/**
 * OPTIONS /api/analytics/events
 * CORS 预检请求
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
