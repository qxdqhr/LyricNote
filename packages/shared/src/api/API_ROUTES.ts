/**
 * API 端点常量定义
 * 集中管理所有 API 路径
 */

export const API_ROUTES = {
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
} as const;

/**
 * 存储键常量
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  REFRESH_TOKEN: 'refresh_token',
} as const;
