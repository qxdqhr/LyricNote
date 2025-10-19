import { NextRequest, NextResponse } from 'next/server'
import { DrizzleAuthService, getTokenFromRequest } from '@/lib/auth/drizzle-auth'
import { addCorsHeaders, handleCorsPreFlight } from '@/lib/cors'

/**
 * OPTIONS /api/auth/me
 * CORS 预检请求
 */
export async function OPTIONS(request: NextRequest) {
  return handleCorsPreFlight(request)
}

// GET /api/auth/me - 获取当前登录用户信息
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    
    if (!token) {
      const response = NextResponse.json(
        { error: '未提供认证令牌' },
        { status: 401 }
      )
      return addCorsHeaders(response, request)
    }

    // 验证 token 并获取用户信息
    const result = await DrizzleAuthService.verifyToken(token)

    const response = NextResponse.json({
      success: true,
      data: {
        user: result.user,
        session: {
          expiresAt: result.session.expiresAt
        }
      }
    })
    return addCorsHeaders(response, request)

  } catch (error) {
    console.error('Get user error:', error)
    const response = NextResponse.json(
      { 
        success: false,
        error: '获取用户信息失败，请重新登录' 
      },
      { status: 401 }
    )
    return addCorsHeaders(response, request)
  }
}

