import Taro from '@tarojs/taro'
import type { RequestAdapter, RequestConfig } from '@lyricnote/shared'
import { logger } from '../lib/logger'

/**
 * Miniapp 平台请求适配器
 * 基于 Taro.request API
 */
export class MiniappRequestAdapter implements RequestAdapter {
  async request<T = any>(config: RequestConfig): Promise<T> {
    const { url, method = 'GET', headers = {}, body, params } = config

    // 构建 URL（如果有查询参数）
    let fullUrl = url
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      const queryString = searchParams.toString()
      if (queryString) {
        fullUrl += (url.includes('?') ? '&' : '?') + queryString
      }
    }

    try {
      const response = await Taro.request({
        url: fullUrl,
        method: method as any,
        header: {
          'Content-Type': 'application/json',
          ...headers,
        },
        data: body,
      })

      const data = response.data as any

      // 检查响应状态
      if (response.statusCode !== 200) {
        return {
          success: false,
          error: data.error || `请求失败: ${response.statusCode}`,
        } as T
      }

      return data
    } catch (error: any) {
      logger.error('Taro.request error', error instanceof Error ? error : new Error(String(error)))
      return {
        success: false,
        error: error.errMsg || '网络错误，请重试',
      } as T
    }
  }
}

