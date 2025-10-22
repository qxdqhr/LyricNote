/**
 * 埋点统计数据接口
 * Analytics Statistics Endpoint
 */

import { NextRequest } from 'next/server';
import { analyticsHandlers } from '@/lib/analytics';

export const runtime = 'nodejs';

/**
 * GET /api/analytics/stats
 * 获取埋点统计数据
 */
export async function GET(request: NextRequest) {
  return analyticsHandlers.handleStatsGet(request);
}
