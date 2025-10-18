/**
 * 统一的 API 客户端（Backend Web）
 */

import { BaseApiClient, ApiWebStorageAdapter, ApiWebRequestAdapter } from '@lyricnote/shared'

// 创建 API 客户端实例
const apiClient = new BaseApiClient(
  new ApiWebStorageAdapter(),
  new ApiWebRequestAdapter(),
  '/api'
)

// 初始化客户端
apiClient.init()

// 导出客户端和方法
export { apiClient }
export const { login, logout, register, isAuthenticated, getCurrentUser, getToken, getUser, clearUserData } = apiClient

