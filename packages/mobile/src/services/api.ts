/**
 * Mobile 端 API 服务
 * 使用 shared 包的统一 API 客户端 + Mobile 平台适配器
 */

import { BaseApiClient } from '@lyricnote/shared'
import { MobileStorageAdapter } from '../adapters/storage'
import { MobileRequestAdapter } from '../adapters/request'

// API 配置
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api'

/**
 * 创建 Mobile 端 API 客户端实例
 */
const apiClient = new BaseApiClient(
  new MobileStorageAdapter(),
  new MobileRequestAdapter(),
  API_BASE_URL
)

// 初始化（从存储中加载 token）
apiClient.init()

/**
 * 导出 API 服务实例
 * 兼容旧的 apiService 命名
 */
export const apiService = apiClient
export default apiClient

/**
 * 快捷方法导出（可选）
 * 方便直接调用，无需通过 apiService
 */
export const {
  login,
  logout,
  register,
  getCurrentUser,
  isAuthenticated,
  getToken,
  getUser,
} = apiClient
