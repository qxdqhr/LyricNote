import type { RequestAdapter, RequestConfig } from '../api/request-adapter'

/**
 * Web 平台请求适配器
 * 基于标准 fetch API
 * 
 * 适用平台：
 * - Web (Next.js)
 * - Desktop (Electron)
 * - Mobile (React Native)
 */
export class WebRequestAdapter implements RequestAdapter {
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

    // 发送请求
    const response = await fetch(fullUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    // 解析响应
    const data = await response.json()

    // 如果响应不成功，返回错误格式
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `请求失败: ${response.status}`,
      } as T
    }

    return data
  }
}

