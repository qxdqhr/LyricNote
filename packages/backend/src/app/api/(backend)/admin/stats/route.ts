import { NextResponse } from 'next/server'
import { createAdminRoute } from '@/middleware'
import { db } from '@/lib/drizzle/db'
import { user, songs, recognitions, systemConfigs } from '../../../../../../drizzle/migrations/schema'
import { count, gte, desc, sql } from 'drizzle-orm'

// GET /api/admin/stats - 获取管理后台统计数据
export const GET = createAdminRoute(async (request, context) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const last7Days = new Date()
  last7Days.setDate(last7Days.getDate() - 7)

  const last30Days = new Date()
  last30Days.setDate(last30Days.getDate() - 30)

  // 基础统计数据
  const [
    totalUsersResult,
    totalSongsResult,
    totalRecognitionsResult,
    todayRecognitionsResult,
    recentRecognitions
  ] = await Promise.all([
    // 总用户数
    db.select({ count: count() }).from(user),
    
    // 总歌曲数
    db.select({ count: count() }).from(songs),
    
    // 总识别次数
    db.select({ count: count() }).from(recognitions),
    
    // 今日识别次数
    db.select({ count: count() })
      .from(recognitions)
      .where(gte(recognitions.createdAt, today.toISOString())),
    
    // 最近识别记录
    db.select()
      .from(recognitions)
      .orderBy(desc(recognitions.createdAt))
      .limit(10)
  ])

  // 提取统计数字
  const totalUsers = totalUsersResult[0]?.count || 0
  const totalSongs = totalSongsResult[0]?.count || 0
  const totalRecognitions = totalRecognitionsResult[0]?.count || 0
  const todayRecognitions = todayRecognitionsResult[0]?.count || 0

  // 获取今天新增用户数
  const todayUsersResult = await db.select({ count: count() })
    .from(user)
    .where(gte(user.createdAt, today.toISOString()))
  const todayUsers = todayUsersResult[0]?.count || 0

  // 获取配置项数量
  const totalConfigsResult = await db.select({ count: count() }).from(systemConfigs)
  const totalConfigs = totalConfigsResult[0]?.count || 0

  // 获取系统信息
  const systemInfo = {
    nodeVersion: process.version,
    platform: process.platform,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  }

  const stats = {
    overview: {
      totalUsers,
      totalSongs,
      totalRecognitions,
      totalConfigs,
      todayUsers,
      todayRecognitions,
    },
    recentActivity: {
      recognitions: recentRecognitions.map(r => ({
        id: r.id,
        status: r.status,
        createdAt: r.createdAt,
        userId: r.userId
      }))
    },
    system: systemInfo
  }

  return NextResponse.json({
    success: true,
    data: stats
  })
})
