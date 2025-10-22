/**
 * 用户行为分析接口
 * User Behavior Analytics Endpoint
 */

import { NextRequest } from 'next/server';
import { analyticsHandlers } from '@/lib/analytics';

export const runtime = 'nodejs';

/**
 * GET /api/analytics/user/[userId]
 * 获取指定用户的行为分析
 */
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  return analyticsHandlers.handleUserBehaviorGet(request, params);
}
