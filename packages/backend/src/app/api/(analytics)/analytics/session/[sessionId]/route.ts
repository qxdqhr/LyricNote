/**
 * 会话分析接口
 * Session Analytics Endpoint
 */

import { NextRequest } from 'next/server';
import { analyticsHandlers } from '@/lib/analytics';

export const runtime = 'nodejs';

/**
 * GET /api/analytics/session/[sessionId]
 * 获取指定会话的详细分析
 */
export async function GET(request: NextRequest, { params }: { params: { sessionId: string } }) {
  return analyticsHandlers.handleSessionAnalyticsGet(request, params);
}
