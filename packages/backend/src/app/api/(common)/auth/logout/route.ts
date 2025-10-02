import { NextRequest, NextResponse } from 'next/server'
import { DrizzleAuthService, getTokenFromRequest } from '@/lib/auth/drizzle-auth'

// POST /api/auth/logout - 用户登出
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    
    if (!token) {
      return NextResponse.json(
        { error: '未提供认证令牌' },
        { status: 401 }
      )
    }

    // 删除会话
    await DrizzleAuthService.signOut(token)

    return NextResponse.json({
      success: true,
      message: '登出成功'
    })

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: '登出失败' 
      },
      { status: 500 }
    )
  }
}

