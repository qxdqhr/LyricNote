import { NextRequest, NextResponse } from 'next/server'
import aiService from '@/services/ai'
import japaneseService from '@/services/japanese'
import cacheService from '@/lib/redis'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, from, to, useAI = true } = body

    if (!text) {
      return NextResponse.json(
        { error: '文本内容不能为空' },
        { status: 400 }
      )
    }

    const supportedFormats = ['kanji', 'hiragana', 'romaji', 'translation']
    if (to && !supportedFormats.includes(to)) {
      return NextResponse.json(
        { error: '不支持的转换格式' },
        { status: 400 }
      )
    }

    // 生成缓存键
    const cacheKey = `convert:${crypto.createHash('md5').update(`${text}:${from}:${to}:${useAI}`).digest('hex')}`
    
    // 检查缓存
    const cachedResult = await cacheService.get(cacheKey)
    if (cachedResult) {
      return NextResponse.json({
        success: true,
        data: cachedResult,
        cached: true
      })
    }

    let result: any = {}

    try {
      if (useAI && aiService) {
        // 使用 AI 服务进行转换
        if (to === 'translation') {
          result.translation = await aiService.translateToChinese(text)
        } else if (to === 'furigana') {
          result.furigana = await aiService.generateFurigana(text)
        } else {
          // 完整转换
          const aiResult = await aiService.convertLyrics(text)
          result = {
            original: text,
            kanji: aiResult.kanji,
            hiragana: aiResult.hiragana,
            romaji: aiResult.romaji,
            translation: aiResult.translation
          }
        }
      } else {
        // 使用本地日语处理服务
        const localResult = await japaneseService.processLyrics(text)
        result = {
          original: text,
          kanji: localResult.kanji,
          hiragana: localResult.hiragana,
          romaji: localResult.romaji
        }
      }

      // 如果指定了目标格式，只返回该格式
      if (to && to !== 'all') {
        const specificResult = result[to]
        if (specificResult) {
          result = { [to]: specificResult }
        }
      }

      // 缓存结果
      await cacheService.set(cacheKey, result, 3600) // 1小时

      return NextResponse.json({
        success: true,
        data: result,
        meta: {
          processingMethod: useAI ? 'ai' : 'local',
          cached: false
        }
      })

    } catch (error) {
      console.error('Conversion error:', error)
      
      // 如果 AI 转换失败，尝试使用本地转换
      if (useAI) {
        try {
          const fallbackResult = await japaneseService.processLyrics(text)
          result = {
            original: text,
            kanji: fallbackResult.kanji,
            hiragana: fallbackResult.hiragana,
            romaji: fallbackResult.romaji
          }

          // 如果指定了目标格式，只返回该格式
          if (to && to !== 'all') {
            const specificResult = result[to]
            if (specificResult) {
              result = { [to]: specificResult }
            }
          }

          return NextResponse.json({
            success: true,
            data: result,
            meta: {
              processingMethod: 'local_fallback',
              cached: false,
              warning: 'AI processing failed, used local processing'
            }
          })
        } catch (fallbackError) {
          console.error('Fallback conversion also failed:', fallbackError)
          throw error
        }
      } else {
        throw error
      }
    }

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '转换失败，请重试' },
      { status: 500 }
    )
  }
}

// 批量转换
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { texts, to = 'all', useAI = true } = body

    if (!Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json(
        { error: '文本数组不能为空' },
        { status: 400 }
      )
    }

    if (texts.length > 10) {
      return NextResponse.json(
        { error: '批量处理最多支持10个文本' },
        { status: 400 }
      )
    }

    const results = []

    for (const text of texts) {
      try {
        // 生成缓存键
        const cacheKey = `convert:${crypto.createHash('md5').update(`${text}:batch:${to}:${useAI}`).digest('hex')}`
        
        // 检查缓存
        let result = await cacheService.get(cacheKey)
        
        if (!result) {
          if (useAI) {
            const aiResult = await aiService.convertLyrics(text)
            result = {
              original: text,
              kanji: aiResult.kanji,
              hiragana: aiResult.hiragana,
              romaji: aiResult.romaji,
              translation: aiResult.translation
            }
          } else {
            const localResult = await japaneseService.processLyrics(text)
            result = {
              original: text,
              kanji: localResult.kanji,
              hiragana: localResult.hiragana,
              romaji: localResult.romaji
            }
          }
          
          // 缓存结果
          await cacheService.set(cacheKey, result, 3600)
        }

        results.push(result)
      } catch (error) {
        console.error(`Error processing text: ${text}`, error)
        results.push({
          original: text,
          error: 'Processing failed'
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      meta: {
        total: texts.length,
        processed: results.filter(r => !r.error).length,
        failed: results.filter(r => r.error).length,
        processingMethod: useAI ? 'ai' : 'local'
      }
    })

  } catch (error) {
    console.error('Batch API error:', error)
    return NextResponse.json(
      { error: '批量转换失败' },
      { status: 500 }
    )
  }
}
