import { NextRequest, NextResponse } from 'next/server'
import { getConfigService, ConfigCategory } from '../../../../../../lib/config/config-service'
import { db } from '../../../../../../lib/drizzle/db'
import { aiProcessLogs } from '../../../../../../../drizzle/migrations/schema'
import { DrizzleAuthService, getTokenFromRequest } from '../../../../../../lib/auth/drizzle-auth'
import crypto from 'crypto'

// GET /api/admin/config/[category] - 获取分类下的配置
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: '未提供认证令牌' }, { status: 401 })
    }
    await DrizzleAuthService.requireAdmin(token)

    const { category } = await params

    // 验证分类是否有效
    if (!Object.values(ConfigCategory).includes(category as ConfigCategory)) {
      return NextResponse.json({
        success: false,
        error: '无效的配置分类'
      }, { status: 400 })
    }

    const configService = getConfigService()
    const configs = await configService.getConfigsByCategory(category as ConfigCategory)

    return NextResponse.json({
      success: true,
      data: {
        category,
        configs
      }
    })
  } catch (error) {
    console.error('获取配置失败:', error)
    return NextResponse.json({
      success: false,
      error: '获取配置失败'
    }, { status: 500 })
  }
}

// POST /api/admin/config/[category] - 更新分类下的配置
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: '未提供认证令牌' }, { status: 401 })
    }
    await DrizzleAuthService.requireAdmin(token)

    const { category } = await params
    const body = await request.json()
    const { configs } = body

    // 验证分类是否有效
    if (!Object.values(ConfigCategory).includes(category as ConfigCategory)) {
      return NextResponse.json({
        success: false,
        error: '无效的配置分类'
      }, { status: 400 })
    }

    if (!configs || typeof configs !== 'object') {
      return NextResponse.json({
        success: false,
        error: '配置数据格式错误'
      }, { status: 400 })
    }

    const configService = getConfigService()

    // 验证所有配置项
    for (const [key, value] of Object.entries(configs)) {
      try {
        configService.validateConfig(key, value)
      } catch (error: any) {
        return NextResponse.json({
          success: false,
          error: `配置 ${key} 验证失败: ${error.message}`
        }, { status: 400 })
      }
    }

    // 批量设置配置
    await configService.setConfigs(configs)
    
    // JWT 密钥更新由 Better-Auth 自动处理
    if (configs.jwt_secret) {
      console.log('🔑 JWT 密钥已更新，Better-Auth 会自动处理')
    }

    // 记录操作日志
    await db.insert(aiProcessLogs).values({
      id: crypto.randomBytes(16).toString('hex'),
      type: 'config_category_update',
      inputData: { category, configKeys: Object.keys(configs) },
      outputData: { success: true, updatedCount: Object.keys(configs).length },
      apiProvider: 'system',
      tokens: 0,
      cost: 0,
      duration: 0,
      status: 'success'
    })

    return NextResponse.json({
      success: true,
      message: `成功更新分类 ${category} 下的 ${Object.keys(configs).length} 个配置项`
    })
  } catch (error) {
    console.error('更新配置失败:', error)
    
    // 记录错误日志
    try {
      await db.insert(aiProcessLogs).values({
        id: crypto.randomBytes(16).toString('hex'),
        type: 'config_category_update',
        inputData: {},
        outputData: null,
        apiProvider: 'system',
        tokens: 0,
        cost: 0,
        duration: 0,
        status: 'error',
        error: (error as any).message
      })
    } catch (logError) {
      console.error('记录日志失败:', logError)
    }

    return NextResponse.json({
      success: false,
      error: '更新配置失败'
    }, { status: 500 })
  }
}
