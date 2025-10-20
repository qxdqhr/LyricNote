import { NextRequest, NextResponse } from 'next/server'
import { createAdminRoute } from '@/middleware'
import { getConfigService, ConfigCategory } from '../../../../../../lib/config/config-service'
import { maskConfigs, isMaskedValue } from '../../../../../../lib/config/mask'
import { db } from '../../../../../../lib/drizzle/db'
import crypto from 'crypto'

// GET /api/admin/config/[category] - 获取分类下的配置
export const GET = createAdminRoute(async (request, context) => {
  const { category } = await context.params

  // 验证分类是否有效
  if (!Object.values(ConfigCategory).includes(category as ConfigCategory)) {
    return NextResponse.json({
      success: false,
      error: '无效的配置分类'
    }, { status: 400 })
  }

  const configService = getConfigService()
  const configs = await configService.getConfigsByCategory(category as ConfigCategory)
  
  // 🔒 对敏感配置进行掩码处理
  const maskedConfigs = maskConfigs(configs)

  return NextResponse.json({
    success: true,
    data: {
      category,
      configs: maskedConfigs
    }
  })
})

// POST /api/admin/config/[category] - 更新分类下的配置
export const POST = createAdminRoute(async (request, context) => {
  const { category } = await context.params
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
  
  // 🔒 获取当前配置（用于检测掩码值）
  const currentConfigs = await configService.getConfigsByCategory(category as ConfigCategory)
  
  // 过滤掉未修改的掩码值
  const updates: Record<string, any> = {}
  let skippedCount = 0
  
  for (const [key, value] of Object.entries(configs)) {
    const currentConfig = currentConfigs[key]
    
    // 如果是敏感配置且值是掩码值（未修改），则跳过
    if (currentConfig?.isSensitive && typeof value === 'string' && typeof currentConfig.value === 'string') {
      if (isMaskedValue(value, currentConfig.value)) {
        console.log(`ℹ️  [Config] Skipping unchanged masked value for ${key}`)
        skippedCount++
        continue
      }
    }
    
    updates[key] = value
  }

  // 验证要更新的配置项
  for (const [key, value] of Object.entries(updates)) {
    try {
      configService.validateConfig(key, value)
    } catch (error: any) {
      return NextResponse.json({
        success: false,
        error: `配置 ${key} 验证失败: ${error.message}`
      }, { status: 400 })
    }
  }

  // 批量设置配置（只设置真正修改的配置）
  if (Object.keys(updates).length > 0) {
    await configService.setConfigs(updates)
    console.log(`✅ [Config] Updated ${Object.keys(updates).length} configs in category ${category}`)
  }
  
  if (skippedCount > 0) {
    console.log(`ℹ️  [Config] Skipped ${skippedCount} unchanged masked values`)
  }
  
  // JWT 密钥更新由 Better-Auth 自动处理
  if (updates.jwt_secret) {
    console.log('🔑 JWT 密钥已更新，Better-Auth 会自动处理')
  }

  return NextResponse.json({
    success: true,
    message: `成功更新 ${Object.keys(updates).length} 个配置项${skippedCount > 0 ? `（跳过 ${skippedCount} 个未修改的敏感配置）` : ''}`
  })
})
