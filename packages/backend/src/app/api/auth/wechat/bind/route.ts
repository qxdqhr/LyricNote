/**
 * 绑定微信账号 API
 * POST /api/auth/wechat/bind
 */

import { NextRequest, NextResponse } from 'next/server';
import { WechatAuthService } from '@/lib/wechat/auth-service';
import { logger as baseLogger } from '@/lib/logger';

const logger = baseLogger.createChild('WechatBindAPI');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, platform, code } = body;

    // 验证必需参数
    if (!userId || !platform || !code) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必需参数：userId、platform 和 code',
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

    logger.info('收到微信绑定请求', { userId, platform });

    // 调用登录服务获取微信用户信息
    const authService = new WechatAuthService();
    let wechatUserInfo;

    switch (platform) {
      case 'web':
        wechatUserInfo = await authService.webLogin(code);
        break;
      case 'miniapp':
        wechatUserInfo = await authService.miniappLogin(code);
        break;
      case 'mobile':
        wechatUserInfo = await authService.mobileLogin(code);
        break;
    }

    // 绑定微信账号
    await authService.bindOrCreateUser(platform, wechatUserInfo);

    logger.info('微信账号绑定成功', { userId, platform, openid: wechatUserInfo.openid });

    return NextResponse.json({
      success: true,
      message: '绑定成功',
      wechatUserInfo,
    });
  } catch (error) {
    logger.error('微信绑定失败', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '绑定失败',
      },
      { status: 500 }
    );
  }
}

