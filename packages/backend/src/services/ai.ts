import { getConfig } from '@/lib/config/config-service'
import { db } from '@/lib/drizzle/db'
import { aiProcessLogs } from '../../drizzle/migrations/schema'
import { gte, lte, eq, sql } from 'drizzle-orm'
import crypto from 'crypto'

export interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface SongRecognitionResult {
  success: boolean
  title: string
  artist: string
  album?: string
  confidence: number
  metadata?: any
}

export interface LyricsConversionResult {
  kanji: string
  hiragana: string
  romaji: string
  translation?: string
}

export class AIService {
  private static instance: AIService
  private apiKey: string
  private apiUrl: string

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || ''
    this.apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com'
    this.initializeFromConfig()
  }

  private async initializeFromConfig() {
    try {
      // 从数据库配置中获取API密钥和URL
      const apiKey = await getConfig('deepseek_api_key', '')
      const apiUrl = await getConfig('deepseek_api_url', 'https://api.deepseek.com')
      
      if (apiKey) {
        this.apiKey = apiKey
      }
      if (apiUrl) {
        this.apiUrl = apiUrl
      }
    } catch (error) {
      console.warn('从配置数据库加载AI服务配置失败，使用环境变量:', error)
    }
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  private async callDeepSeekAPI(prompt: string, systemPrompt?: string): Promise<DeepSeekResponse> {
    // 在开发环境下，如果没有API密钥，返回模拟响应
    if (process.env.NODE_ENV === 'development' && (!this.apiKey || this.apiKey === '')) {
      console.log('🧪 开发模式：返回模拟API响应');
      return {
        choices: [{
          message: {
            content: JSON.stringify({
              title: '夜に駆ける',
              artist: 'YOASOBI',
              album: 'THE BOOK',
              confidence: 0.95,
              metadata: {
                genre: 'J-Pop',
                year: 2019,
                duration: 240,
                language: 'Japanese'
              }
            })
          }
        }],
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      }
    }

    const startTime = Date.now()
    
    try {
      const response = await fetch(`${this.apiUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 2000
        })
      })

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const duration = Date.now() - startTime

      // 记录 AI 处理日志
      await this.logAIProcess({
        type: 'deepseek_completion',
        inputData: { prompt, systemPrompt },
        outputData: data,
        apiProvider: 'DeepSeek',
        tokens: data.usage?.total_tokens || 0,
        duration,
        status: 'success'
      })

      return data
    } catch (error) {
      const duration = Date.now() - startTime
      
      // 记录错误日志
      await this.logAIProcess({
        type: 'deepseek_completion',
        inputData: { prompt, systemPrompt },
        outputData: null,
        apiProvider: 'DeepSeek',
        tokens: 0,
        duration,
        status: 'error',
        error: error instanceof Error ? error.message : String(error)
      })

      throw error
    }
  }

  async recognizeSong(audioFeatures: any): Promise<SongRecognitionResult> {
    // 临时强制使用模拟数据进行测试
    console.log('🧪 强制使用模拟识别结果进行测试');
    return {
      success: true,
      title: '夜に駆ける',
      artist: 'YOASOBI',
      album: 'THE BOOK',
      confidence: 0.95,
      metadata: {
        genre: 'J-Pop',
        year: 2019,
        duration: 240,
        language: 'Japanese'
      }
    }

    const systemPrompt = `你是一个专业的日语歌曲识别专家。根据提供的音频特征，识别出对应的日语歌曲信息。
请返回 JSON 格式的结果，包含以下字段：
- title: 歌曲名称
- artist: 艺术家名称
- album: 专辑名称（可选）
- confidence: 识别置信度（0-1之间的数字）
- metadata: 其他相关信息`

    const prompt = `请根据以下音频特征识别日语歌曲：
${JSON.stringify(audioFeatures, null, 2)}

请返回准确的歌曲信息，特别注意日语歌曲的特殊性。`

    const response = await this.callDeepSeekAPI(prompt, systemPrompt)
    
    try {
      const content = response.choices[0]?.message?.content || '{}'
      return JSON.parse(content)
    } catch (error) {
      throw new Error('Failed to parse song recognition result')
    }
  }

  async convertLyrics(lyrics: string): Promise<LyricsConversionResult> {
    const systemPrompt = `你是一个专业的日语歌词处理专家。请将提供的日语歌词转换为不同的显示格式。
返回 JSON 格式，包含以下字段：
- kanji: 保持原始汉字的版本
- hiragana: 全平假名版本
- romaji: 罗马音版本（使用 Hepburn 罗马化）
- translation: 中文翻译（可选）

请确保转换的准确性，特别注意日语的语法和发音规则。`

    const prompt = `请转换以下日语歌词：
${lyrics}

请提供准确的平假名和罗马音转换，以及自然的中文翻译。`

    const response = await this.callDeepSeekAPI(prompt, systemPrompt)
    
    try {
      const content = response.choices[0]?.message?.content || '{}'
      return JSON.parse(content)
    } catch (error) {
      throw new Error('Failed to parse lyrics conversion result')
    }
  }

  async generateFurigana(text: string): Promise<Array<{text: string, reading: string}>> {
    const systemPrompt = `你是一个日语假名标注专家。为提供的日语文本生成准确的假名标注。
返回 JSON 数组格式，每个元素包含：
- text: 原文本片段
- reading: 对应的假名读音

特别注意汉字的正确读音，包括训读和音读。`

    const prompt = `请为以下日语文本生成假名标注：
${text}`

    const response = await this.callDeepSeekAPI(prompt, systemPrompt)
    
    try {
      const content = response.choices[0]?.message?.content || '[]'
      return JSON.parse(content)
    } catch (error) {
      throw new Error('Failed to parse furigana result')
    }
  }

  async translateToChinese(japaneseText: string): Promise<string> {
    const systemPrompt = `你是一个专业的日中翻译专家，特别擅长日语歌词的翻译。
请提供自然流畅的中文翻译，保持歌词的韵律感和情感表达。`

    const prompt = `请将以下日语歌词翻译成中文：
${japaneseText}`

    const response = await this.callDeepSeekAPI(prompt, systemPrompt)
    
    return response.choices[0]?.message?.content || japaneseText
  }

  // 批量处理歌词
  async processLyricsBatch(lyricsArray: string[]): Promise<LyricsConversionResult[]> {
    // 分批处理以避免单次请求过大
    const batchSize = 5
    const results: LyricsConversionResult[] = []

    for (let i = 0; i < lyricsArray.length; i += batchSize) {
      const batch = lyricsArray.slice(i, i + batchSize)
      const batchResults = await Promise.all(
        batch.map(lyrics => this.convertLyrics(lyrics))
      )
      results.push(...batchResults)
    }

    return results
  }

  private async logAIProcess(logData: {
    type: string
    inputData: any
    outputData: any
    apiProvider: string
    tokens: number
    duration: number
    status: string
    error?: string
  }): Promise<void> {
    try {
      
      await db.insert(aiProcessLogs).values({
        id: crypto.randomBytes(16).toString('hex'),
        type: logData.type,
        inputData: logData.inputData,
        outputData: logData.outputData,
        apiProvider: logData.apiProvider,
        tokens: logData.tokens,
        cost: this.calculateCost(logData.tokens, logData.apiProvider),
        duration: logData.duration,
        status: logData.status,
        error: logData.error,
        createdAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to log AI process:', error)
    }
  }

  private calculateCost(tokens: number, provider: string): number {
    // DeepSeek 的价格计算（示例价格）
    if (provider === 'DeepSeek') {
      return tokens * 0.00002 // 假设每 token 0.00002 元
    }
    return 0
  }

  // 获取 AI 使用统计
  async getUsageStats(startDate: Date, endDate: Date): Promise<any> {
    try {
      // 使用 Drizzle 的 SQL 查询来实现 groupBy 功能
      const stats = await db.execute(sql`
        SELECT 
          type,
          "apiProvider",
          SUM(tokens) as tokens_sum,
          SUM(cost) as cost_sum,
          COUNT(id) as count,
          AVG(duration) as duration_avg
        FROM ${aiProcessLogs}
        WHERE "createdAt" >= ${startDate.toISOString()}
          AND "createdAt" <= ${endDate.toISOString()}
        GROUP BY type, "apiProvider"
      `)

      return stats.rows || []
    } catch (error) {
      console.error('Failed to get AI usage stats:', error)
      return []
    }
  }
}

export default AIService.getInstance()
