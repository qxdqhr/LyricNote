import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export class CacheService {
  private static instance: CacheService
  private redis: Redis

  constructor() {
    this.redis = redis
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService()
    }
    return CacheService.instance
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value)
      if (ttl) {
        await this.redis.setex(key, ttl, serialized)
      } else {
        await this.redis.set(key, serialized)
      }
      return true
    } catch (error) {
      console.error('Cache set error:', error)
      return false
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      await this.redis.del(key)
      return true
    } catch (error) {
      console.error('Cache delete error:', error)
      return false
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key)
      return result === 1
    } catch (error) {
      console.error('Cache exists error:', error)
      return false
    }
  }

  // 日语歌词缓存相关方法
  async getLyrics(songId: string): Promise<any | null> {
    return this.get(`lyrics:${songId}`)
  }

  async setLyrics(songId: string, lyrics: any): Promise<boolean> {
    const ttl = parseInt(process.env.LYRICS_CACHE_TTL || '86400')
    return this.set(`lyrics:${songId}`, lyrics, ttl)
  }

  async getRecognitionResult(audioHash: string): Promise<any | null> {
    return this.get(`recognition:${audioHash}`)
  }

  async setRecognitionResult(audioHash: string, result: any): Promise<boolean> {
    const ttl = parseInt(process.env.CACHE_TTL || '3600')
    return this.set(`recognition:${audioHash}`, result, ttl)
  }
}

export default CacheService.getInstance()
