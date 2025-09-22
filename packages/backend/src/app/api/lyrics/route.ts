import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'
import cacheService from '@/lib/redis'
import aiService from '@/services/ai'
import japaneseService from '@/services/japanese'

// 获取歌词
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const songId = searchParams.get('songId')
    const format = searchParams.get('format') || 'all' // all, kanji, hiragana, romaji

    if (!songId) {
      return NextResponse.json(
        { error: '歌曲ID不能为空' },
        { status: 400 }
      )
    }

    // 检查缓存
    const cacheKey = `lyrics:${songId}:${format}`
    const cachedLyrics = await cacheService.get(cacheKey)
    if (cachedLyrics) {
      return NextResponse.json({
        success: true,
        data: cachedLyrics,
        cached: true
      })
    }

    // 从数据库获取歌词
    const lyrics = await prisma.lyric.findFirst({
      where: {
        songId,
        status: 'APPROVED'
      },
      include: {
        song: true
      }
    })

    if (!lyrics) {
      return NextResponse.json(
        { error: '未找到歌词' },
        { status: 404 }
      )
    }

    // 根据格式返回相应的歌词版本
    let result: any = {
      id: lyrics.id,
      songId: lyrics.songId,
      song: lyrics.song,
      timeStamps: lyrics.timeStamps,
      version: lyrics.version,
      createdAt: lyrics.createdAt,
      updatedAt: lyrics.updatedAt
    }

    switch (format) {
      case 'kanji':
        result.content = lyrics.kanji || lyrics.content
        break
      case 'hiragana':
        result.content = lyrics.hiragana || lyrics.content
        break
      case 'romaji':
        result.content = lyrics.romaji || lyrics.content
        break
      default:
        result = {
          ...result,
          original: lyrics.content,
          kanji: lyrics.kanji,
          hiragana: lyrics.hiragana,
          romaji: lyrics.romaji,
          translation: lyrics.translation
        }
    }

    // 缓存结果
    await cacheService.set(cacheKey, result, 86400) // 24小时

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// 创建或更新歌词
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { songId, content, userId, isUpdate = false, lyricId } = body

    if (!songId || !content) {
      return NextResponse.json(
        { error: '歌曲ID和歌词内容不能为空' },
        { status: 400 }
      )
    }

    // 验证歌曲存在
    const song = await prisma.song.findUnique({
      where: { id: songId }
    })

    if (!song) {
      return NextResponse.json(
        { error: '歌曲不存在' },
        { status: 404 }
      )
    }

    let lyrics: any

    if (isUpdate && lyricId) {
      // 更新现有歌词
      lyrics = await prisma.lyric.findUnique({
        where: { id: lyricId }
      })

      if (!lyrics) {
        return NextResponse.json(
          { error: '歌词不存在' },
          { status: 404 }
        )
      }
    }

    // 使用日语处理服务处理歌词
    const processedLyrics = await japaneseService.processLyrics(content)

    // 使用 AI 服务进行翻译和优化
    let aiProcessedLyrics
    try {
      aiProcessedLyrics = await aiService.convertLyrics(content)
    } catch (error) {
      console.warn('AI processing failed, using local processing:', error)
      aiProcessedLyrics = processedLyrics
    }

    const lyricData = {
      songId,
      content: content,
      kanji: aiProcessedLyrics.kanji || processedLyrics.kanji,
      hiragana: aiProcessedLyrics.hiragana || processedLyrics.hiragana,
      romaji: aiProcessedLyrics.romaji || processedLyrics.romaji,
      translation: aiProcessedLyrics.translation,
      status: 'PENDING' as const,
      version: lyrics ? lyrics.version + 1 : 1
    }

    if (isUpdate && lyricId) {
      // 更新歌词
      lyrics = await prisma.lyric.update({
        where: { id: lyricId },
        data: lyricData,
        include: {
          song: true
        }
      })
    } else {
      // 创建新歌词
      lyrics = await prisma.lyric.create({
        data: lyricData,
        include: {
          song: true
        }
      })
    }

    // 如果提供了用户ID，创建用户歌词记录
    if (userId) {
      await prisma.userLyric.upsert({
        where: {
          userId_lyricId: {
            userId,
            lyricId: lyrics.id
          }
        },
        update: {
          content,
          updatedAt: new Date()
        },
        create: {
          userId,
          lyricId: lyrics.id,
          content,
          isPublic: false
        }
      })
    }

    // 清除相关缓存
    await Promise.all([
      cacheService.del(`lyrics:${songId}:all`),
      cacheService.del(`lyrics:${songId}:kanji`),
      cacheService.del(`lyrics:${songId}:hiragana`),
      cacheService.del(`lyrics:${songId}:romaji`)
    ])

    return NextResponse.json({
      success: true,
      data: lyrics
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
