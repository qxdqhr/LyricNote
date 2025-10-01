import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/drizzle/db'
import { recognitions, user } from '../../../../drizzle/migrations/schema'
import { eq } from 'drizzle-orm'
import aiService from '@/services/ai'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const userId = formData.get('userId') as string

    if (!audioFile) {
      return NextResponse.json(
        { error: '音频文件不能为空' },
        { status: 400 }
      )
    }

    // 验证文件类型和大小
    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/m4a', 'audio/aac']
    if (!allowedTypes.includes(audioFile.type)) {
      return NextResponse.json(
        { error: '不支持的音频格式' },
        { status: 400 }
      )
    }

    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { error: '文件大小超过限制' },
        { status: 400 }
      )
    }

    // 生成文件哈希用于去重
    const arrayBuffer = await audioFile.arrayBuffer()
    const hash = crypto.createHash('md5').update(Buffer.from(arrayBuffer)).digest('hex')

    // 验证用户是否存在（如果提供了 userId）
    let validUserId = null
    if (userId) {
      const [existingUser] = await db.select().from(user).where(eq(user.id, userId)).limit(1)
      if (existingUser) {
        validUserId = userId
        console.log(`✅ 用户验证成功: ${userId}`)
      } else {
        console.log(`❌ 用户不存在: ${userId}`)
      }
    }

    // 创建识别记录
    const [recognition] = await db.insert(recognitions).values({
      id: crypto.randomBytes(16).toString('hex'),
      userId: validUserId,
      audioUrl: `temp/${hash}.${audioFile.name.split('.').pop()}`,
      status: 'PROCESSING',
      createdAt: new Date().toISOString(),
    }).returning()

    console.log(`🎵 开始识别音频: ${audioFile.name}, 大小: ${audioFile.size} bytes`)

    try {
      // 调用 AI 服务进行识别
      const recognitionResult = await aiService.recognizeSong(arrayBuffer)
      console.log('🤖 AI 识别结果:', recognitionResult)

      // 更新识别记录
      await db.update(recognitions)
        .set({
          result: recognitionResult as any, // 类型断言
          confidence: recognitionResult.confidence || 0,
          status: recognitionResult.success ? 'SUCCESS' : 'FAILED',
          createdAt: new Date().toISOString()
        })
        .where(eq(recognitions.id, recognition.id))

      return NextResponse.json({
        success: true,
        data: {
          id: recognition.id,
          result: recognitionResult,
          status: recognitionResult.success ? 'SUCCESS' : 'FAILED',
          confidence: recognitionResult.confidence || 0,
          createdAt: recognition.createdAt
        }
      })

    } catch (aiError :any) {
      console.error('❌ AI 识别失败:', aiError)
      
      // 更新识别记录为失败状态
      await db.update(recognitions)
        .set({
          status: 'FAILED',
          result: { error: aiError.message},
          createdAt: new Date().toISOString()
        })
        .where(eq(recognitions.id, recognition.id))

      return NextResponse.json({
        success: false,
        error: '音频识别失败',
        data: {
          id: recognition.id,
          status: 'FAILED',
          createdAt: recognition.createdAt
        }
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ 识别接口错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// 获取识别历史
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    if (!userId) {
      return NextResponse.json(
        { error: '用户ID不能为空' },
        { status: 400 }
      )
    }

    // 验证用户存在
    const [existingUser] = await db.select().from(user).where(eq(user.id, userId)).limit(1)
    if (!existingUser) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 获取识别历史
    const userRecognitions = await db.select({
      id: recognitions.id,
      result: recognitions.result,
      status: recognitions.status,
      confidence: recognitions.confidence,
      createdAt: recognitions.createdAt
    })
      .from(recognitions)
      .where(eq(recognitions.userId, userId))
      .orderBy(recognitions.createdAt)
      .limit(limit)
      .offset(offset)

    return NextResponse.json({
      success: true,
      data: {
        recognitions: userRecognitions,
        pagination: {
          page,
          limit,
          total: userRecognitions.length // 简化版本，实际应该查询总数
        }
      }
    })

  } catch (error) {
    console.error('获取识别历史失败:', error)
    return NextResponse.json(
      { error: '获取识别历史失败' },
      { status: 500 }
    )
  }
}