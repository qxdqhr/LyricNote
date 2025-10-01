import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/drizzle/db'
import { lyrics, songs, userLyrics } from '../../../../drizzle/migrations/schema'
import { eq, and } from 'drizzle-orm'
import aiService from '@/services/ai'
import crypto from 'crypto'

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

    // 从数据库获取歌词（简化查询）
    const [lyricData] = await db.select()
      .from(lyrics)
      .where(and(
        eq(lyrics.songId, songId),
        eq(lyrics.status, 'APPROVED')
      ))
      .limit(1)

    if (!lyricData) {
      return NextResponse.json(
        { error: '未找到歌词' },
        { status: 404 }
      )
    }

    // 根据格式返回相应的歌词版本
    let responseData = lyricData
    if (format !== 'all') {
      responseData = {
        ...lyricData,
        content: (lyricData as any)[format] || lyricData.content
      }
    }

    return NextResponse.json({
      success: true,
      data: responseData
    })

  } catch (error) {
    console.error('获取歌词失败:', error)
    return NextResponse.json(
      { error: '获取歌词失败' },
      { status: 500 }
    )
  }
}

// 创建或更新歌词
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { songId, userId, content, type = 'user_contribution' } = body

    if (!songId || !content) {
      return NextResponse.json(
        { error: '歌曲ID和歌词内容不能为空' },
        { status: 400 }
      )
    }

    // 检查歌曲是否存在
    const [song] = await db.select().from(songs).where(eq(songs.id, songId)).limit(1)
    if (!song) {
      return NextResponse.json(
        { error: '歌曲不存在' },
        { status: 404 }
      )
    }

    let lyricData
    
    // 检查是否已有歌词
    const [existingLyric] = await db.select()
      .from(lyrics)
      .where(eq(lyrics.songId, songId))
      .limit(1)

    if (existingLyric) {
      // 更新现有歌词
      [lyricData] = await db.update(lyrics)
        .set({
          content,
          status: 'PENDING',
          updatedAt: new Date().toISOString()
        })
        .where(eq(lyrics.id, existingLyric.id))
        .returning()
    } else {
      // 创建新歌词
      [lyricData] = await db.insert(lyrics).values({
        id: crypto.randomBytes(16).toString('hex'),
        songId,
        content,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }).returning()
    }

    // 如果提供了用户ID，记录用户贡献
    if (userId && lyricData) {
      try {
        await db.insert(userLyrics).values({
          id: crypto.randomBytes(16).toString('hex'),
          userId,
          lyricId: lyricData.id,
          content: content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }).onConflictDoUpdate({
          target: [userLyrics.userId, userLyrics.lyricId],
          set: {
            content: content,
            updatedAt: new Date().toISOString()
          }
        })
      } catch (error) {
        console.warn('记录用户贡献失败:', error)
      }
    }

    return NextResponse.json({
      success: true,
      data: lyricData,
      message: existingLyric ? '歌词已更新' : '歌词已创建'
    })

  } catch (error) {
    console.error('创建/更新歌词失败:', error)
    return NextResponse.json(
      { error: '创建/更新歌词失败' },
      { status: 500 }
    )
  }
}