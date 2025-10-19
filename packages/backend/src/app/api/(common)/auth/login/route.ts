import { NextRequest, NextResponse } from 'next/server'
import { DrizzleAuthService } from '@/lib/auth/drizzle-auth'
import { analyticsService } from '@/lib/analytics'
import { randomBytes } from 'crypto'
import { addCorsHeaders, handleCorsPreFlight } from '@/lib/cors'

/**
 * OPTIONS /api/auth/login
 * CORS 预检请求
 */
export async function OPTIONS(request: NextRequest) {
  return handleCorsPreFlight(request)
}

// POST /api/auth/login - 用户登录（通用接口，客户端和管理后台都可以使用）
export async function POST(request: NextRequest) {
  let requestBody: any = {}
  
  try {
    requestBody = await request.json()
    const { email, password } = requestBody

    // 验证必填字段
    if (!email || !password) {
      const response = NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      )
      return addCorsHeaders(response, request)
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

    // 创建响应
    const response = NextResponse.json({
      success: true,
      data: {
        user: result.user,
        token: result.token, // 保留 token 返回，兼容移动端
      },
      message: '登录成功'
    })

    // 🔐 设置 httpOnly Cookie（管理后台使用，更安全）
    response.cookies.set({
      name: 'auth_token',
      value: result.token,
      httpOnly: true,  // JavaScript 无法访问，防止 XSS 攻击
      secure: process.env.NODE_ENV === 'production', // 生产环境仅 HTTPS
      sameSite: 'lax', // 防止 CSRF，lax 允许从外部链接跳转
      maxAge: 60 * 60 * 24 * 7, // 7天过期
      path: '/', // 所有路径可用
    })

    return addCorsHeaders(response, request)

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
    
    const response = NextResponse.json(
      { 
        success: false,
        error: (error as any).message || '登录失败，请检查邮箱和密码' 
      },
      { status: 401 }
    )
    return addCorsHeaders(response, request)
  }
}

