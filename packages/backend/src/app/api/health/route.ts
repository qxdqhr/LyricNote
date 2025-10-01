import { NextResponse } from 'next/server'
import { db } from '@/lib/drizzle/db'
import { sql } from 'drizzle-orm'

export async function GET() {
  try {
    const startTime = Date.now()
    
    // 检查数据库连接
    let databaseStatus = 'healthy'
    let databaseLatency = 0
    try {
      const dbStart = Date.now()
      await db.execute(sql`SELECT 1`)
      databaseLatency = Date.now() - dbStart
    } catch (error) {
      databaseStatus = 'unhealthy'
      console.error('Database health check failed:', error)
    }

    // 检查 Redis 连接
    let cacheStatus = 'healthy'
    let cacheLatency = 0
    try {
      // const cacheStart = Date.now()
      // await cacheService.set('health_check', 'ok', 10)
      // cacheLatency = Date.now() - cacheStart
      cacheStatus = 'not_configured' // 暂时标记为未配置
    } catch (error) {
      cacheStatus = 'unhealthy'
      console.error('Cache health check failed:', error)
    }

    // 检查环境变量
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'NEXTAUTH_SECRET'
    ]
    
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])
    const configStatus = missingEnvVars.length === 0 ? 'healthy' : 'incomplete'

    // AI 服务状态
    const aiStatus = process.env.DEEPSEEK_API_KEY ? 'configured' : 'not_configured'

    const totalLatency = Date.now() - startTime
    const overallStatus = databaseStatus === 'healthy' && 
                         (cacheStatus === 'healthy' || cacheStatus === 'not_configured') && 
                         configStatus === 'healthy' ? 'healthy' : 'degraded'

    const healthData = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
      services: {
        database: {
          status: databaseStatus,
          latency: `${databaseLatency}ms`
        },
        cache: {
          status: cacheStatus,
          latency: `${cacheLatency}ms`
        },
        ai: {
          status: aiStatus
        }
      },
      config: {
        status: configStatus,
        missing: missingEnvVars
      },
      performance: {
        responseTime: `${totalLatency}ms`,
        memoryUsage: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
        }
      },
      environment: process.env.NODE_ENV || 'development'
    }

    return NextResponse.json(healthData, {
      status: overallStatus === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      version: '1.0.0'
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      }
    })
  }
}
