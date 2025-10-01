import { NextRequest, NextResponse } from 'next/server'
import { DrizzleAuthService, getTokenFromRequest } from '@/lib/auth/drizzle-auth'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    
    if (!token) {
      return NextResponse.json(
        { error: '未提供认证令牌' },
        { status: 401 }
      )
    }

    const result = await DrizzleAuthService.getSession(token)
    
    if (!result) {
      return NextResponse.json(
        { error: '会话无效或已过期' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      session: result.session,
    })
  } catch (error) {
    console.error('获取会话错误:', error)
    return NextResponse.json(
      { error: '获取会话失败' },
      { status: 401 }
    )
  }
}
