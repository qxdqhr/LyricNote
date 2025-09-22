import Kuroshiro from 'kuroshiro'
// import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'

export interface JapaneseLyricsResult {
  original: string
  kanji: string
  hiragana: string
  romaji: string
  translation?: string
}

export interface FuriganaResult {
  text: string
  reading: string
}

export class JapaneseProcessingService {
  private static instance: JapaneseProcessingService
  private kuroshiro: Kuroshiro | null = null
  private initialized = false

  constructor() {
    this.initializeKuroshiro()
  }

  static getInstance(): JapaneseProcessingService {
    if (!JapaneseProcessingService.instance) {
      JapaneseProcessingService.instance = new JapaneseProcessingService()
    }
    return JapaneseProcessingService.instance
  }

  private async initializeKuroshiro(): Promise<void> {
    try {
      this.kuroshiro = new Kuroshiro()
      // 注意：在生产环境中需要正确配置 MeCab 分析器
      // await this.kuroshiro.init(new KuromojiAnalyzer())
      this.initialized = true
      console.log('Kuroshiro initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Kuroshiro:', error)
      this.initialized = false
    }
  }

  async convertToHiragana(text: string): Promise<string> {
    if (!this.initialized || !this.kuroshiro) {
      console.warn('Kuroshiro not initialized, returning original text')
      return text
    }

    try {
      const result = await this.kuroshiro.convert(text, { 
        to: 'hiragana' 
      })
      return result
    } catch (error) {
      console.error('Error converting to hiragana:', error)
      return text
    }
  }

  async convertToRomaji(text: string): Promise<string> {
    if (!this.initialized || !this.kuroshiro) {
      console.warn('Kuroshiro not initialized, returning original text')
      return text
    }

    try {
      const result = await this.kuroshiro.convert(text, { 
        to: 'romaji',
        romajiSystem: 'hepburn'
      })
      return result
    } catch (error) {
      console.error('Error converting to romaji:', error)
      return text
    }
  }

  async getFurigana(text: string): Promise<FuriganaResult[]> {
    if (!this.initialized || !this.kuroshiro) {
      console.warn('Kuroshiro not initialized')
      return [{ text, reading: text }]
    }

    try {
      // 这里需要根据实际的 Kuroshiro API 进行调整
      const result = await this.kuroshiro.convert(text, { 
        to: 'hiragana',
        mode: 'furigana'
      })
      
      // 简化的实现，实际应该解析更复杂的结构
      return [{ text, reading: result }]
    } catch (error) {
      console.error('Error getting furigana:', error)
      return [{ text, reading: text }]
    }
  }

  async processLyrics(lyrics: string): Promise<JapaneseLyricsResult> {
    const lines = lyrics.split('\n')
    const processedLines = await Promise.all(
      lines.map(async (line) => {
        if (!line.trim()) return {
          original: line,
          kanji: line,
          hiragana: line,
          romaji: line
        }

        const hiragana = await this.convertToHiragana(line)
        const romaji = await this.convertToRomaji(line)

        return {
          original: line,
          kanji: line, // 保持原始文本（包含汉字）
          hiragana,
          romaji
        }
      })
    )

    return {
      original: lyrics,
      kanji: processedLines.map(l => l.kanji).join('\n'),
      hiragana: processedLines.map(l => l.hiragana).join('\n'),
      romaji: processedLines.map(l => l.romaji).join('\n')
    }
  }

  // 批量处理歌词
  async processLyricsBatch(lyricsArray: string[]): Promise<JapaneseLyricsResult[]> {
    const results = await Promise.all(
      lyricsArray.map(lyrics => this.processLyrics(lyrics))
    )
    return results
  }

  // 检测文本是否包含日语
  isJapaneseText(text: string): boolean {
    // 检测平假名、片假名、汉字
    const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/
    return japaneseRegex.test(text)
  }

  // 提取汉字
  extractKanji(text: string): string[] {
    const kanjiRegex = /[\u4E00-\u9FAF]/g
    return text.match(kanjiRegex) || []
  }

  // 提取假名
  extractKana(text: string): string[] {
    const kanaRegex = /[\u3040-\u309F\u30A0-\u30FF]/g
    return text.match(kanaRegex) || []
  }
}

export default JapaneseProcessingService.getInstance()
