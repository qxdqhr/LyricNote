import { NextRequest, NextResponse } from 'next/server'
import { getConfigService, ConfigCategory } from '../../../../../lib/config/config-service'
import { getDatabaseConfigForDisplay } from '../../../../../lib/config/database-config'
import { db } from '../../../../../lib/drizzle/db'
import { aiProcessLogs } from '../../../../../../drizzle/migrations/schema'
import { DrizzleAuthService, getTokenFromRequest } from '../../../../../lib/auth/drizzle-auth'
import crypto from 'crypto'

// GET /api/admin/config - 获取所有配置
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: '未提供认证令牌' }, { status: 401 })
    }
    await DrizzleAuthService.requireAdmin(token)

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
        'database_connection_username': {
          key: 'database_connection_username',
          value: databaseConnectionInfo.username,
          type: 'string',
          isRequired: true,
          isSensitive: false,
          description: '数据库用户名 (只读)',
          readonly: true
        },
        'database_connection_source': {
          key: 'database_connection_source',
          value: databaseConnectionInfo.source,
          type: 'string',
          isRequired: false,
          isSensitive: false,
          description: '配置来源 (只读)',
          readonly: true
        }
      }
      
      console.log('allConfigs', allConfigs)
      // 将连接信息添加到database配置的开头
      allConfigs.database = { ...connectionItems, ...allConfigs.database }
    }

    return NextResponse.json({
      success: true,
      data: allConfigs
    })
  } catch (error) {
    console.error('获取配置失败:', error)
    return NextResponse.json({
      success: false,
      error: '获取配置失败'
    }, { status: 500 })
  }
}

// POST /api/admin/config - 批量更新配置
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: '未提供认证令牌' }, { status: 401 })
    }
    await DrizzleAuthService.requireAdmin(token)

    const body = await request.json()
    const { configs, category } = body

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
      } catch (error :any) {
        return NextResponse.json({
          success: false,
          error: `配置验证失败: ${error.message}`
        }, { status: 400 })
      }
    }

    // 批量设置配置
    await configService.setConfigs(configs)

    // 记录操作日志
    await db.insert(aiProcessLogs).values({
      id: crypto.randomBytes(16).toString('hex'),
      type: 'config_update',
      inputData: { category, configs: Object.keys(configs) },
      outputData: { success: true },
      apiProvider: 'system',
      tokens: 0,
      cost: 0,
      duration: 0,
      status: 'success',
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: `成功更新 ${Object.keys(configs).length} 个配置项`
    })
  } catch (error) {
    console.error('更新配置失败:', error)
    
    // 记录错误日志
    try {
      await db.insert(aiProcessLogs).values({
        id: crypto.randomBytes(16).toString('hex'),
        type: 'config_update',
        inputData: {},
        outputData: {},
        apiProvider: 'system',
        tokens: 0,
        cost: 0,
        duration: 0,
        status: 'error',
        error: (error as any).message as string,
        createdAt: new Date().toISOString()
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

// PUT /api/admin/config - 设置单个配置
export async function PUT(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: '未提供认证令牌' }, { status: 401 })
    }
    await DrizzleAuthService.requireAdmin(token)

    const body = await request.json()
    const { key, value, description } = body

    if (!key) {
      return NextResponse.json({
        success: false,
        error: '配置键名不能为空'
      }, { status: 400 })
    }

    const configService = getConfigService()

    // 验证配置
    try {
      configService.validateConfig(key, value)
    } catch (error :any) {
      return NextResponse.json({
        success: false,
        error: `配置验证失败: ${error.message}`
      }, { status: 400 })
    }

    // 设置配置
    await configService.setConfig(key, value, description)

    return NextResponse.json({
      success: true,
      message: `配置 ${key} 更新成功`
    })
  } catch (error) {
    console.error('设置配置失败:', error)
    return NextResponse.json({
      success: false,
      error: '设置配置失败'
    }, { status: 500 })
  }
}

// DELETE /api/admin/config - 删除配置
export async function DELETE(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: '未提供认证令牌' }, { status: 401 })
    }
    const data = await DrizzleAuthService.requireAdmin(token)
    if (data.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ 
        success: false, 
        error: '需要超级管理员权限' 
      }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json({
        success: false,
        error: '配置键名不能为空'
      }, { status: 400 })
    }

    const configService = getConfigService()
    await configService.deleteConfig(key)

    return NextResponse.json({
      success: true,
      message: `配置 ${key} 删除成功`
    })
  } catch (error) {
    console.error('删除配置失败:', error)
    return NextResponse.json({
      success: false,
      error: '删除配置失败'
    }, { status: 500 })
  }
}
