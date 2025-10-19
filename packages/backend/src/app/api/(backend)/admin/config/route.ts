import { NextResponse } from 'next/server'
import { createAdminRoute } from '@/middleware'
import { getConfigService, ConfigCategory } from '../../../../../lib/config/config-service'
import { getDatabaseConfigForDisplay } from '../../../../../lib/config/database-config'
import { db } from '../../../../../lib/drizzle/db'
import crypto from 'crypto'

// GET /api/admin/config - 获取所有配置
export const GET = createAdminRoute(async (request, context) => {
  const configService = getConfigService()
  const allConfigs = await configService.getAllConfigs()
  
  // 为database分类添加数据库连接信息（只读显示）
  if (allConfigs.database) {
    const databaseConnectionInfo = getDatabaseConfigForDisplay()
    
    // 将数据库连接信息转换为配置项格式，用于只读显示
    const connectionItems = {
      'database_connection_host': {
        key: 'database_connection_host',
        value: databaseConnectionInfo.host,
        type: 'string',
        isRequired: true,
        isSensitive: false,
        description: '数据库主机地址 (只读)',
        readonly: true
      },
      'database_connection_port': {
        key: 'database_connection_port', 
        value: databaseConnectionInfo.port,
        type: 'number',
        isRequired: true,
        isSensitive: false,
        description: '数据库端口 (只读)',
        readonly: true
      },
      'database_connection_database': {
        key: 'database_connection_database',
        value: databaseConnectionInfo.database,
        type: 'string',
        isRequired: true,
        isSensitive: false,
        description: '数据库名称 (只读)',
        readonly: true
      },
      'database_connection_user': {
        key: 'database_connection_user',
        value: databaseConnectionInfo.user,
        type: 'string',
        isRequired: true,
        isSensitive: false,
        description: '数据库用户名 (只读)',
        readonly: true
      }
    }

    // 合并连接信息到database配置分类中
    allConfigs.database = {
      ...connectionItems,
      ...allConfigs.database
    }
  }

  return NextResponse.json({
    success: true,
    data: allConfigs
  })
})

// POST /api/admin/config - 创建新配置
export const POST = createAdminRoute(async (request, context) => {
  const body = await request.json()
  const { category, key, value, type, description, isRequired, isSensitive } = body

  // 验证必填字段
  if (!category || !key || value === undefined || !type) {
    return NextResponse.json({
      success: false,
      error: '缺少必填字段'
    }, { status: 400 })
  }

  // 验证分类是否有效
  if (!Object.values(ConfigCategory).includes(category as ConfigCategory)) {
    return NextResponse.json({
      success: false,
      error: '无效的配置分类'
    }, { status: 400 })
  }

  const configService = getConfigService()
  await configService.setConfig(key, value, description)

  return NextResponse.json({
    success: true,
    data: { key, value, description }
  })
})

// PUT /api/admin/config - 批量更新配置
export const PUT = createAdminRoute(async (request, context) => {
  const body = await request.json()
  const { configs } = body

  if (!Array.isArray(configs) || configs.length === 0) {
    return NextResponse.json({
      success: false,
      error: '请提供要更新的配置列表'
    }, { status: 400 })
  }

  const configService = getConfigService()
  const results = []

  for (const config of configs) {
    const { key, value } = config
    if (!key || value === undefined) {
      continue
    }

    await configService.setConfig(key, value)
    results.push({ key, value })
  }

  return NextResponse.json({
    success: true,
    data: results,
    message: `成功更新 ${results.length} 个配置`
  })
})

// DELETE /api/admin/config - 删除配置
export const DELETE = createAdminRoute(async (request, context) => {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')

  if (!key) {
    return NextResponse.json({
      success: false,
      error: '请提供配置键名'
    }, { status: 400 })
  }

  const configService = getConfigService()
  await configService.deleteConfig(key)

  return NextResponse.json({
    success: true,
    message: '配置已删除'
  })
})
