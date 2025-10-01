import { NextRequest, NextResponse } from 'next/server'
import { getConfigService } from '../../../../../lib/config/config-service'
import { db } from '../../../../../lib/drizzle/db'
import { aiProcessLogs } from '../../../../../../drizzle/migrations/schema'
import { DrizzleAuthService, getTokenFromRequest } from '../../../../../lib/auth/drizzle-auth'
import crypto from 'crypto'

// POST /api/admin/config/validate - 验证配置
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: '未提供认证令牌' }, { status: 401 })
    }
    await DrizzleAuthService.requireAdmin(token)

    const body = await request.json()
    const { key, value, type } = body

    if (!key || value === undefined) {
      return NextResponse.json({
        success: false,
        error: '缺少必要参数'
      }, { status: 400 })
    }

    const configService = getConfigService()
    
    try {
      // 验证配置值
      configService.validateConfig(key, value)

      // 记录验证日志
      await db.insert(aiProcessLogs).values({
        id: crypto.randomBytes(16).toString('hex'),
        type: 'config_validate',
        inputData: { key, value: typeof value === 'string' ? value.substring(0, 100) : value },
        outputData: { valid: true },
        apiProvider: 'system',
        tokens: 0,
        cost: 0,
        duration: 0,
        status: 'success',
        createdAt: new Date().toISOString(),
        // updatedAt: new Date().toISOString()
      })

      return NextResponse.json({
        success: true,
        message: '配置验证通过'
      })
    } catch (error:any) {
      console.error('配置验证失败:', error)
      
      // 记录错误日志
      try {
        await db.insert(aiProcessLogs).values({
          id: crypto.randomBytes(16).toString('hex'),
          type: 'config_validate',
          inputData: { key },
          outputData: {},
          apiProvider: 'system',
          tokens: 0,
          cost: 0,
          duration: 0,
          status: 'error',
          error: error.message,
          createdAt: new Date().toISOString(),
          // updatedAt: new Date().toISOString()
        })
      } catch (logError) {
        console.error('记录日志失败:', logError)
      }

      return NextResponse.json({
        success: false,
        error: '配置验证失败'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('配置验证接口错误:', error)
    return NextResponse.json({
      success: false,
      error: '服务器内部错误'
    }, { status: 500 })
  }
}