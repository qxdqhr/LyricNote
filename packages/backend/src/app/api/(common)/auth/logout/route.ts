import { NextRequest, NextResponse } from 'next/server';
import { DrizzleAuthService, getTokenFromRequest } from '@/lib/auth/drizzle-auth';
import { analyticsService } from '@/lib/analytics';
import { randomBytes } from 'crypto';

// POST /api/auth/logout - 用户登出
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json({ error: '未提供认证令牌' }, { status: 401 });
    }

    // 获取用户信息（用于埋点）
    let userId: string | undefined;
    let userEmail: string | undefined;
    let userRole: string | undefined;

    try {
      const result = await DrizzleAuthService.verifyToken(token);
      userId = result.user.id;
      userEmail = result.user.email;
      userRole = result.user.role;
    } catch (error) {
      console.error('Failed to decode token for analytics:', error);
    }

    // 删除会话
    await DrizzleAuthService.signOut(token);

    // 记录退出登录埋点（服务端）
    try {
      await analyticsService.insertAnalyticsEvents([
        {
          id: randomBytes(16).toString('hex'),
          eventType: 'logout',
          eventName: 'user_logout_success',
          timestamp: new Date().toISOString(),
          priority: 1,
          userId: userId,
          sessionId: `session_${Date.now()}_${userId || 'unknown'}`,
          deviceId: request.headers.get('user-agent') || 'unknown',
          platform: 'backend',
          appVersion: '1.0.0',
          sdkVersion: '1.0.0',
          properties: {
            userRole: userRole,
            email: userEmail,
            logoutMethod: 'manual',
            ip:
              request.headers.get('x-forwarded-for') ||
              request.headers.get('x-real-ip') ||
              'unknown',
            userAgent: request.headers.get('user-agent'),
          },
        },
      ]);
    } catch (analyticsError) {
      // 埋点失败不影响登出流程
      console.error('Failed to track logout analytics:', analyticsError);
    }

    // 创建响应
    const response = NextResponse.json({
      success: true,
      message: '登出成功',
    });

    // 🔐 清除 httpOnly Cookie
    response.cookies.delete('auth_token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);

    // 记录退出登录失败埋点
    try {
      await analyticsService.insertAnalyticsEvents([
        {
          id: randomBytes(16).toString('hex'),
          eventType: 'error',
          eventName: 'user_logout_failed',
          timestamp: new Date().toISOString(),
          priority: 1,
          sessionId: `session_${Date.now()}_anonymous`,
          deviceId: request.headers.get('user-agent') || 'unknown',
          platform: 'backend',
          appVersion: '1.0.0',
          sdkVersion: '1.0.0',
          properties: {
            errorMessage: (error as any).message || '退出登录失败',
            ip:
              request.headers.get('x-forwarded-for') ||
              request.headers.get('x-real-ip') ||
              'unknown',
          },
        },
      ]);
    } catch (analyticsError) {
      console.error('Failed to track logout failure analytics:', analyticsError);
    }

    return NextResponse.json(
      {
        success: false,
        error: '登出失败',
      },
      { status: 500 }
    );
  }
}
