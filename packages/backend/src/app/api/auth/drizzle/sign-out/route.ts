import { NextRequest, NextResponse } from 'next/server'
import { DrizzleAuthService, getTokenFromRequest } from '@/lib/auth/drizzle-auth'

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    
    if (!token) {
      return NextResponse.json(
        { error: '未提供认证令牌' },
        { status: 401 }
      )
    }

    // 删除服务器端会话
    const result = await DrizzleAuthService.signOut(token)

    // 清除 cookie
    const response = NextResponse.json({
      success: true,
      message: '登出成功'
    })

    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // 立即过期
    })

    return response
  } catch (error) {
    console.error('登出错误:', error)
    return NextResponse.json(
      { error: '登出失败' },
      { status: 500 }
    )
  }
}
