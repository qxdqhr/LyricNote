/**
 * Backend 配置管理 Hook
 * 基于 shared 的通用 useConfigs
 */

import { createUseConfigs } from '@lyricnote/shared'

// 创建特定于 backend 的 useConfigs Hook
export const useConfigs = createUseConfigs({
  apiBaseUrl: '', // 使用相对路径
  getAuthToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token')
    }
    return null
  },
  onUnauthorized: () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login'
    }
  },
  dedupingInterval: 60000, // 60秒缓存
  revalidateOnFocus: false
})
