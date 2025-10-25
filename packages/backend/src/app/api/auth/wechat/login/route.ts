/**
 * 微信登录 API
 * POST /api/auth/wechat/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { WechatAuthService } from '@/lib/wechat/auth-service';
import { logger as baseLogger } from '@/lib/logger';

const logger = baseLogger.createChild('WechatLoginAPI');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, code, state } = body;

    // 验证必需参数
    if (!platform || !code) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必需参数：platform 和 code',
        },
        { status: 400 }
      );
    }

    // 验证平台类型
    if (!['web', 'miniapp', 'mobile'].includes(platform)) {
      return NextResponse.json(
        {
          success: false,
          error: '不支持的平台类型',
        },
        { status: 400 }
      );
    }

    logger.info('收到微信登录请求', { platform, code });

    // 调用登录服务
    const authService = new WechatAuthService();
    const result = await authService.login({ platform, code, state });

    if (!result.success) {
      return NextResponse.json(result, { status: 401 });
    }

    logger.info('微信登录成功', { userId: result.userId, platform });

    return NextResponse.json(result);
  } catch (error) {
    logger.error('微信登录失败', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '登录失败',
      },
      { status: 500 }
    );
  }
}
