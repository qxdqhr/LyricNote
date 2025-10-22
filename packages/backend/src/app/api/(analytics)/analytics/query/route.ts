/**
 * 埋点数据查询接口
 * Analytics Query Endpoint
 */

import { NextRequest } from 'next/server';
import { analyticsHandlers } from '@/lib/analytics';

export const runtime = 'nodejs';

/**
 * GET /api/analytics/query
 * 查询埋点事件
 */
export async function GET(request: NextRequest) {
  return analyticsHandlers.handleQueryGet(request);
}
