import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromRequest, DrizzleAuthService } from '@/lib/auth/drizzle-auth'
import { getConfigService } from '@/lib/config/config-service'
import { addCorsHeaders, handleCorsPreFlight } from '@/lib/cors'

/**
 * OPTIONS /api/ai/config
 * CORS 预检请求
 */
export async function OPTIONS(request: NextRequest) {
  return handleCorsPreFlight(request)
}

// GET /api/ai/config - 获取 AI 配置信息（不包含敏感信息）
export async function GET(request: NextRequest) {
  try {
    // 验证用户登录状态
    const token = getTokenFromRequest(request)
    if (!token) {
      const response = NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
      return addCorsHeaders(response, request)
    }

    // 验证 token
    try {
      await DrizzleAuthService.verifyToken(token)
    } catch (error) {
      const response = NextResponse.json(
        { error: '登录已过期' },
        { status: 401 }
      )
      return addCorsHeaders(response, request)
    }

    // 从配置中获取 AI 服务配置（不返回 API Key）
    const configService = getConfigService()
    const aiApiKey = await configService.getConfig('ai_model_api_key')
    const aiApiUrl = await configService.getConfig('ai_model_api_base_url')
    const aiModel = await configService.getConfig('ai_model_name')

    const response = NextResponse.json({
      success: true,
      data: {
        configured: !!(aiApiKey && aiApiUrl && aiModel),
        apiUrl: aiApiUrl || null,
        model: aiModel || null,
        // 不返回实际的 API Key，只返回是否已配置和部分掩码
        apiKeyConfigured: !!aiApiKey,
        apiKeyMasked: aiApiKey ? `${aiApiKey.substring(0, 7)}...${aiApiKey.substring(aiApiKey.length - 4)}` : null,
      }
    })
    return addCorsHeaders(response, request)

  } catch (error) {
    console.error('Get AI config error:', error)
    
    const response = NextResponse.json(
      { 
        success: false,
        error: (error as any).message || '获取配置失败' 
      },
      { status: 500 }
    )
    return addCorsHeaders(response, request)
  }
}

