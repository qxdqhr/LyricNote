import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConfigForDisplay } from '../../../../lib/config/database-config'
import { DrizzleAuthService, getTokenFromRequest } from '../../../../lib/auth/drizzle-auth'

// GET /api/admin/database-connection - 获取数据库连接信息
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: '未提供认证令牌' }, { status: 401 })
    }
    await DrizzleAuthService.requireAdmin(token)

    const connectionInfo = getDatabaseConfigForDisplay()
    
    return NextResponse.json({
      success: true,
      data: connectionInfo
    })
  } catch (error) {
    console.error('获取数据库连接信息失败:', error)
    return NextResponse.json({
      success: false,
      error: '获取数据库连接信息失败'
    }, { status: 500 })
  }
}