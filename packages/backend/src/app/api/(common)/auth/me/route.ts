import { NextRequest, NextResponse } from 'next/server'
import { DrizzleAuthService, getTokenFromRequest } from '@/lib/auth/drizzle-auth'

// GET /api/auth/me - 获取当前登录用户信息
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    
    if (!token) {
      return NextResponse.json(
        { error: '未提供认证令牌' },
        { status: 401 }
      )
    }

    // 验证 token 并获取用户信息
    const result = await DrizzleAuthService.verifyToken(token)

    return NextResponse.json({
      success: true,
      data: {
        user: result.user,
        session: {
          expiresAt: result.session.expiresAt
        }
      }
    })

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: '获取用户信息失败，请重新登录' 
      },
      { status: 401 }
    )
  }
}

