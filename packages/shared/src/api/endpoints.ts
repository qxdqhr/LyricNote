/**
 * API 端点常量定义
 * 集中管理所有 API 路径
 */

export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },

  // 用户相关
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },

  // 歌曲相关
  SONGS: {
    LIST: '/songs',
    DETAIL: (id: string) => `/songs/${id}`,
    CREATE: '/songs',
    UPDATE: (id: string) => `/songs/${id}`,
    DELETE: (id: string) => `/songs/${id}`,
  },

  // 歌词相关
  LYRICS: {
    LIST: '/lyrics',
    DETAIL: (id: string) => `/lyrics/${id}`,
    CONVERT: '/lyrics/convert',
  },

  // 收藏相关
  COLLECTIONS: {
    LIST: '/collections',
    DETAIL: (id: string) => `/collections/${id}`,
    CREATE: '/collections',
    UPDATE: (id: string) => `/collections/${id}`,
    DELETE: (id: string) => `/collections/${id}`,
  },

  // 音乐识别
  RECOGNITION: {
    RECOGNIZE: '/recognition',
    HISTORY: '/recognition',
  },
} as const

/**
 * 存储键常量
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  REFRESH_TOKEN: 'refresh_token',
} as const

