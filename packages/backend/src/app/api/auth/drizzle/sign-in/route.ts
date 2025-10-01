import { NextRequest, NextResponse } from 'next/server'
import { DrizzleAuthService } from '@/lib/auth/drizzle-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      )
    }

    const result = await DrizzleAuthService.signIn(email, password)

    // 设置 cookie
    const response = NextResponse.json({
      success: true,
      user: result.user,
      token: result.token,
    })

    response.cookies.set('auth-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7天
    })

    return response
  } catch (error) {
    console.error('登录错误:', error)
    return NextResponse.json(
      { error: (error as any).message || '登录失败' },
      { status: 401 }
    )
  }
}
