import { NextRequest, NextResponse } from 'next/server'
import { DrizzleAuthService } from '@/lib/auth/drizzle-auth'
import { analyticsService } from '@/lib/analytics'
import { randomBytes } from 'crypto'

// POST /api/auth/login - 用户登录（通用接口，客户端和管理后台都可以使用）
export async function POST(request: NextRequest) {
  let requestBody: any = {}
  
  try {
    requestBody = await request.json()
    const { email, password } = requestBody

    // 验证必填字段
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      )
    }

    // 使用 DrizzleAuthService 登录
    const result = await DrizzleAuthService.signIn(email, password)

    // 记录登录成功埋点（服务端）
    try {
      await analyticsService.insertAnalyticsEvents([{
        id: randomBytes(16).toString('hex'),
        eventType: 'login',
        eventName: 'user_login_success',
        timestamp: new Date().toISOString(),
        priority: 1,
        userId: result.user.id,
        sessionId: `session_${Date.now()}_${result.user.id}`,
        deviceId: request.headers.get('user-agent') || 'unknown',
        platform: 'backend',
        appVersion: '1.0.0',
        sdkVersion: '1.0.0',
        properties: {
          userRole: result.user.role,
          email: result.user.email,
          loginMethod: 'email_password',
          ip: request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              'unknown',
          userAgent: request.headers.get('user-agent'),
        },
      }])
    } catch (analyticsError) {
      // 埋点失败不影响登录流程
      console.error('Failed to track login analytics:', analyticsError)
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: '登录成功'
    })

  } catch (error) {
    console.error('Login error:', error)
    
    // 记录登录失败埋点
    try {
      await analyticsService.insertAnalyticsEvents([{
        id: randomBytes(16).toString('hex'),
        eventType: 'error',
        eventName: 'user_login_failed',
        timestamp: new Date().toISOString(),
        priority: 1,
        sessionId: `session_${Date.now()}_anonymous`,
        deviceId: request.headers.get('user-agent') || 'unknown',
        platform: 'backend',
        appVersion: '1.0.0',
        sdkVersion: '1.0.0',
        properties: {
          errorMessage: (error as any).message || '登录失败',
          email: requestBody.email, // 不记录密码
          ip: request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              'unknown',
        },
      }])
    } catch (analyticsError) {
      console.error('Failed to track login failure analytics:', analyticsError)
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: (error as any).message || '登录失败，请检查邮箱和密码' 
      },
      { status: 401 }
    )
  }
}

