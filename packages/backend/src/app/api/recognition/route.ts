import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'
import cacheService from '@/lib/redis'
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

    // 生成文件哈希用于缓存和去重
    const arrayBuffer = await audioFile.arrayBuffer()
    const hash = crypto.createHash('md5').update(Buffer.from(arrayBuffer)).digest('hex')

    // 检查缓存中是否有识别结果
    const cachedResult = await cacheService.getRecognitionResult(hash)
    if (cachedResult) {
      return NextResponse.json({
        success: true,
        data: cachedResult,
        cached: true
      })
    }

    // 创建识别记录
    const recognition = await prisma.recognition.create({
      data: {
        userId: userId || undefined,
        audioUrl: `/temp/${hash}`, // 临时URL，实际应存储到OSS
        status: 'PROCESSING'
      }
    })

    // 模拟音频特征提取（实际应该使用真实的音频处理库）
    const audioFeatures = {
      duration: audioFile.size / 1000, // 简化的时长估算
      format: audioFile.type,
      size: audioFile.size,
      hash: hash
    }

    try {
      // 调用 AI 服务进行歌曲识别
      const recognitionResult = await aiService.recognizeSong(audioFeatures)

      // 查找或创建歌曲记录
      let song = await prisma.song.findFirst({
        where: {
          title: recognitionResult.title,
          artist: recognitionResult.artist
        }
      })

      if (!song) {
        song = await prisma.song.create({
          data: {
            title: recognitionResult.title,
            artist: recognitionResult.artist,
            album: recognitionResult.album,
            isJapanese: true,
            metadata: recognitionResult.metadata
          }
        })
      }

      // 更新识别记录
      const updatedRecognition = await prisma.recognition.update({
        where: { id: recognition.id },
        data: {
          songId: song.id,
          confidence: recognitionResult.confidence,
          status: 'SUCCESS',
          result: recognitionResult,
          processTime: Date.now() - new Date(recognition.createdAt).getTime()
        },
        include: {
          song: true
        }
      })

      // 缓存识别结果
      await cacheService.setRecognitionResult(hash, {
        recognition: updatedRecognition,
        song: song
      })

      return NextResponse.json({
        success: true,
        data: {
          recognition: updatedRecognition,
          song: song
        }
      })

    } catch (error) {
      // 更新识别记录为失败状态
      await prisma.recognition.update({
        where: { id: recognition.id },
        data: {
          status: 'FAILED',
          result: { error: error instanceof Error ? error.message : 'Unknown error' },
          processTime: Date.now() - new Date(recognition.createdAt).getTime()
        }
      })

      console.error('Recognition error:', error)
      return NextResponse.json(
        { error: '识别失败，请重试' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('API error:', error)
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
    const skip = (page - 1) * limit

    if (!userId) {
      return NextResponse.json(
        { error: '用户ID不能为空' },
        { status: 400 }
      )
    }

    const [recognitions, total] = await Promise.all([
      prisma.recognition.findMany({
        where: { userId },
        include: {
          song: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.recognition.count({
        where: { userId }
      })
    ])

    return NextResponse.json({
      success: true,
      data: {
        recognitions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
