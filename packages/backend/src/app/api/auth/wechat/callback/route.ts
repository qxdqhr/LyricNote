/**
 * 微信网页登录回调 API
 * GET /api/auth/wechat/callback
 */

import { NextRequest, NextResponse } from 'next/server';
import { WechatAuthService } from '@/lib/wechat/auth-service';
import { logger as baseLogger } from '@/lib/logger';

const logger = baseLogger.createChild('WechatCallbackAPI');

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      logger.error('微信回调缺少 code 参数');
      return NextResponse.redirect(new URL('/login?error=missing_code', request.url));
    }

    logger.info('收到微信回调', { code, state });

    // 调用登录服务
    const authService = new WechatAuthService();
    const result = await authService.login({
      platform: 'web',
      code,
      state: state || undefined,
    });

    if (!result.success) {
      logger.error('微信登录失败', result);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(result.error || '登录失败')}`, request.url)
      );
    }

    logger.info('微信登录成功，重定向到首页', { userId: result.userId });

    // 登录成功，重定向到首页
    // TODO: 设置 cookie 或 session
    const response = NextResponse.redirect(new URL('/', request.url));

    // 设置 token（简化版，实际应该使用 httpOnly cookie 或 session）
    if (result.token) {
      response.cookies.set('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return response;
  } catch (error) {
    logger.error('微信回调处理失败', error);
    return NextResponse.redirect(new URL('/login?error=callback_failed', request.url));
  }
}
