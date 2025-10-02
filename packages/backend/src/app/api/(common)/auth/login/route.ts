import { NextRequest, NextResponse } from 'next/server'
import { DrizzleAuthService } from '@/lib/auth/drizzle-auth'

// POST /api/auth/login - 用户登录（通用接口，客户端和管理后台都可以使用）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // 验证必填字段
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      )
    }

    // 使用 DrizzleAuthService 登录
    const result = await DrizzleAuthService.signIn(email, password)

    return NextResponse.json({
      success: true,
      data: result,
      message: '登录成功'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: (error as any).message || '登录失败，请检查邮箱和密码' 
      },
      { status: 401 }
    )
  }
}

