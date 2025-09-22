import { JAPANESE_REGEX } from '../constants'

// 时间格式化工具
export const formatTime = {
  /**
   * 将秒数转换为 MM:SS 格式
   */
  toMinutesSeconds(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  },

  /**
   * 将秒数转换为 HH:MM:SS 格式
   */
  toHoursMinutesSeconds(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  },

  /**
   * 格式化日期为用户友好的格式
   */
  formatDate(date: string | Date): string {
    const d = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return '今天'
    } else if (diffDays === 1) {
      return '昨天'
    } else if (diffDays < 7) {
      return `${diffDays}天前`
    } else {
      return d.toLocaleDateString('zh-CN')
    }
  }
}

// 日语文本处理工具
export const japaneseUtils = {
  /**
   * 检测文本是否包含日语字符
   */
  isJapanese(text: string): boolean {
    return JAPANESE_REGEX.japanese.test(text)
  },

  /**
   * 检测文本是否包含平假名
   */
  hasHiragana(text: string): boolean {
    return JAPANESE_REGEX.hiragana.test(text)
  },

  /**
   * 检测文本是否包含片假名
   */
  hasKatakana(text: string): boolean {
    return JAPANESE_REGEX.katakana.test(text)
  },

  /**
   * 检测文本是否包含汉字
   */
  hasKanji(text: string): boolean {
    return JAPANESE_REGEX.kanji.test(text)
  },

  /**
   * 提取文本中的汉字
   */
  extractKanji(text: string): string[] {
    return text.match(/[\u4E00-\u9FAF]/g) || []
  },

  /**
   * 提取文本中的假名
   */
  extractKana(text: string): string[] {
    return text.match(/[\u3040-\u309F\u30A0-\u30FF]/g) || []
  },

  /**
   * 清理文本，移除特殊字符但保留日语字符
   */
  cleanText(text: string): string {
    return text.replace(/[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\w\s]/g, '')
  }
}

// 验证工具
export const validators = {
  /**
   * 验证邮箱格式
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * 验证密码强度
   */
  isValidPassword(password: string): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []
    
    if (password.length < 6) {
      errors.push('密码长度至少6位')
    }
    
    if (password.length > 50) {
      errors.push('密码长度不能超过50位')
    }
    
    if (!/[a-zA-Z]/.test(password)) {
      errors.push('密码必须包含字母')
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('密码必须包含数字')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  /**
   * 验证用户名格式
   */
  isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    return usernameRegex.test(username)
  },

  /**
   * 验证文件大小
   */
  isValidFileSize(size: number, maxSize: number): boolean {
    return size <= maxSize
  },

  /**
   * 验证音频文件类型
   */
  isValidAudioType(type: string, supportedTypes: string[]): boolean {
    return supportedTypes.includes(type)
  }
}

// 文件处理工具
export const fileUtils = {
  /**
   * 格式化文件大小
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  /**
   * 获取文件扩展名
   */
  getFileExtension(filename: string): string {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
  },

  /**
   * 生成唯一文件名
   */
  generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    const extension = this.getFileExtension(originalName)
    return `${timestamp}_${random}.${extension}`
  }
}

// 数组和对象工具
export const arrayUtils = {
  /**
   * 数组去重
   */
  unique<T>(array: T[]): T[] {
    return [...new Set(array)]
  },

  /**
   * 数组分组
   */
  groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const group = (groups[item[key] as string] || [])
      group.push(item)
      groups[item[key] as string] = group
      return groups
    }, {} as Record<string, T[]>)
  },

  /**
   * 数组分页
   */
  paginate<T>(array: T[], page: number, limit: number): {
    data: T[]
    total: number
    page: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  } {
    const total = array.length
    const pages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const end = start + limit
    const data = array.slice(start, end)

    return {
      data,
      total,
      page,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1
    }
  },

  /**
   * 数组随机排序
   */
  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
}

// 字符串工具
export const stringUtils = {
  /**
   * 截断文本
   */
  truncate(text: string, length: number, suffix = '...'): string {
    if (text.length <= length) return text
    return text.substring(0, length - suffix.length) + suffix
  },

  /**
   * 首字母大写
   */
  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  },

  /**
   * 驼峰转下划线
   */
  camelToSnake(text: string): string {
    return text.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
  },

  /**
   * 下划线转驼峰
   */
  snakeToCamel(text: string): string {
    return text.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
  },

  /**
   * 生成随机字符串
   */
  generateRandom(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}

// 调试工具
export const debugUtils = {
  /**
   * 安全的 JSON 序列化
   */
  safeStringify(obj: any): string {
    try {
      return JSON.stringify(obj, null, 2)
    } catch (error) {
      return `[Circular Reference or Invalid JSON: ${error}]`
    }
  },

  /**
   * 性能计时器
   */
  createTimer(label?: string) {
    const start = performance.now()
    return {
      end: () => {
        const duration = performance.now() - start
        const message = `${label || 'Timer'}: ${duration.toFixed(2)}ms`
        console.log(message)
        return duration
      }
    }
  },

  /**
   * 内存使用情况（仅在 Node.js 环境）
   */
  getMemoryUsage(): Record<string, string> | null {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage()
      return {
        rss: fileUtils.formatFileSize(usage.rss),
        heapTotal: fileUtils.formatFileSize(usage.heapTotal),
        heapUsed: fileUtils.formatFileSize(usage.heapUsed),
        external: fileUtils.formatFileSize(usage.external)
      }
    }
    return null
  }
}

// 错误处理工具
export const errorUtils = {
  /**
   * 创建标准化的错误对象
   */
  createError(code: string, message: string, details?: any): Error & { code: string; details?: any } {
    const error = new Error(message) as Error & { code: string; details?: any }
    error.code = code
    if (details) {
      error.details = details
    }
    return error
  },

  /**
   * 安全的错误信息提取
   */
  extractErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === 'string') {
      return error
    }
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message)
    }
    return '未知错误'
  },

  /**
   * 错误重试机制
   */
  async retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        
        if (attempt === maxAttempts) {
          throw lastError
        }
        
        // 指数退避延迟
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
      }
    }
    
    throw lastError!
  }
}
