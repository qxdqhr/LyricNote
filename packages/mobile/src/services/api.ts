import { ApiResponse, Recognition, Song } from '@lyricnote/shared'

// API配置 - 使用本地开发环境
const API_BASE_URL = 'http://localhost:3000/api'

class ApiService {
  private baseURL: string

  constructor() {
    this.baseURL = API_BASE_URL
  }

  /**
   * 上传音频文件进行识别
   */
  async recognizeAudio(audioUri: string, userId?: string): Promise<ApiResponse<{recognition: Recognition, song: Song}>> {
    try {
      const formData = new FormData()
      
      // 创建音频文件对象
      const audioFile = {
        uri: audioUri,
        type: 'audio/m4a', // Expo录音默认格式
        name: 'recording.m4a'
      } as any

      formData.append('audio', audioFile)
      if (userId) {
        formData.append('userId', userId)
      }

      const response = await fetch(`${this.baseURL}/recognition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Recognition API error:', error)
      throw error
    }
  }

  /**
   * 获取歌曲歌词
   */
  async getLyrics(songId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseURL}/lyrics?songId=${songId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Lyrics API error:', error)
      throw error
    }
  }

  /**
   * 转换歌词格式
   */
  async convertLyrics(lyrics: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseURL}/lyrics/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lyrics }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Lyrics conversion API error:', error)
      throw error
    }
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Health check API error:', error)
      throw error
    }
  }
}

export const apiService = new ApiService()
export default apiService
