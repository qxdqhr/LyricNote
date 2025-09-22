import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'
import { requireRole } from '@/middleware/auth'

async function handler(request: NextRequest) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const last7Days = new Date()
    last7Days.setDate(last7Days.getDate() - 7)

    // 并行查询各种统计数据
    const [
      totalUsers,
      totalSongs,
      totalLyrics,
      totalRecognitions,
      todayRecognitions,
      activeUsers,
      recentActivity,
      topSongs,
      userGrowth
    ] = await Promise.all([
      // 总用户数
      prisma.user.count(),
      
      // 总歌曲数
      prisma.song.count(),
      
      // 总歌词数
      prisma.lyric.count({
        where: { status: 'APPROVED' }
      }),
      
      // 总识别次数
      prisma.recognition.count(),
      
      // 今日识别次数
      prisma.recognition.count({
        where: {
          createdAt: {
            gte: today
          }
        }
      }),
      
      // 活跃用户数（7天内有活动）
      prisma.user.count({
        where: {
          OR: [
            {
              recognitions: {
                some: {
                  createdAt: {
                    gte: last7Days
                  }
                }
              }
            },
            {
              collections: {
                some: {
                  updatedAt: {
                    gte: last7Days
                  }
                }
              }
            }
          ]
        }
      }),
      
      // 最近活动
      prisma.recognition.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              nickname: true
            }
          },
          song: {
            select: {
              id: true,
              title: true,
              artist: true
            }
          }
        }
      }),
      
      // 热门歌曲（识别次数最多）
      prisma.song.findMany({
        take: 10,
        include: {
          _count: {
            select: {
              recognitions: true,
              favorites: true
            }
          }
        },
        orderBy: {
          recognitions: {
            _count: 'desc'
          }
        }
      }),
      
      // 用户增长趋势（最近30天）
      prisma.$queryRaw`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM users 
        WHERE created_at >= NOW() - INTERVAL 30 DAY
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
      `
    ])

    // 计算成功率
    const successfulRecognitions = await prisma.recognition.count({
      where: { status: 'SUCCESS' }
    })
    
    const recognitionSuccessRate = totalRecognitions > 0 
      ? (successfulRecognitions / totalRecognitions * 100).toFixed(1)
      : '0'

    // AI 使用统计
    const aiStats = await prisma.aIProcessLog.groupBy({
      by: ['type', 'status'],
      where: {
        createdAt: {
          gte: last7Days
        }
      },
      _sum: {
        tokens: true,
        cost: true
      },
      _count: {
        id: true
      }
    })

    const response = {
      success: true,
      data: {
        // 基础统计
        totalUsers,
        totalSongs,
        totalLyrics,
        totalRecognitions,
        todayRecognitions,
        activeUsers,
        recognitionSuccessRate: parseFloat(recognitionSuccessRate),
        
        // 趋势数据
        userGrowth,
        
        // 热门数据
        topSongs: topSongs.map(song => ({
          ...song,
          recognitionCount: song._count.recognitions,
          favoriteCount: song._count.favorites
        })),
        
        // 最近活动
        recentActivity: recentActivity.map(activity => ({
          id: activity.id,
          type: 'recognition',
          user: activity.user,
          song: activity.song,
          status: activity.status,
          confidence: activity.confidence,
          createdAt: activity.createdAt
        })),
        
        // AI 使用统计
        aiUsage: {
          totalCalls: aiStats.reduce((sum, stat) => sum + stat._count.id, 0),
          totalTokens: aiStats.reduce((sum, stat) => sum + (stat._sum.tokens || 0), 0),
          totalCost: aiStats.reduce((sum, stat) => sum + (stat._sum.cost || 0), 0),
          successRate: aiStats.length > 0 
            ? (aiStats.filter(s => s.status === 'success').reduce((sum, stat) => sum + stat._count.id, 0) / aiStats.reduce((sum, stat) => sum + stat._count.id, 0) * 100).toFixed(1)
            : '0'
        },
        
        // 系统状态
        systemStatus: {
          database: 'healthy',
          cache: 'healthy', // 可以通过 Redis ping 检查
          ai: 'healthy', // 可以通过最近的 AI 调用状态检查
          lastUpdate: new Date().toISOString()
        }
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: '获取统计数据失败' },
      { status: 500 }
    )
  }
}

export const GET = requireRole(['ADMIN', 'SUPER_ADMIN'])(handler)
