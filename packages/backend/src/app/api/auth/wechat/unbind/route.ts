/**
 * 解绑微信账号 API
 * POST /api/auth/wechat/unbind
 */

import { NextRequest, NextResponse } from 'next/server';

import { WechatAuthService } from '@/lib/wechat/auth-service';
import { logger as baseLogger } from '@/lib/logger';

const logger = baseLogger.createChild('WechatUnbindAPI');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, platform } = body;

    // 验证必需参数
    if (!userId || !platform) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必需参数：userId 和 platform',
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

    logger.info('收到微信解绑请求', { userId, platform });

    // 调用服务解绑
    const authService = new WechatAuthService();
    await authService.unbind(userId, platform);

    logger.info('微信账号解绑成功', { userId, platform });

    return NextResponse.json({
      success: true,
      message: '解绑成功',
    });
  } catch (error) {
    logger.error('微信解绑失败', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '解绑失败',
      },
      { status: 500 }
    );
  }
}
