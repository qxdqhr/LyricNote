/**
 * 漏斗分析接口
 * Funnel Analysis Endpoint
 */

import { NextRequest } from 'next/server';
import { analyticsHandlers } from '@/lib/analytics';

export const runtime = 'nodejs';

/**
 * POST /api/analytics/funnel
 * 获取漏斗分析数据
 */
export async function POST(request: NextRequest) {
  return analyticsHandlers.handleFunnelPost(request);
}
