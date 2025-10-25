/**
 * Desktop 端 API 服务
 * 使用 shared 包的统一 API 客户端 + Web 平台适配器
 * (Desktop 基于 Electron，使用与 Web 相同的 localStorage 和 fetch)
 */

import { BaseApiClient, ElectronStorageAdapter, WebRequestAdapter } from '@lyricnote/shared';

// API 配置
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

/**
 * 创建 Desktop 端 API 客户端实例
 */
const apiClient = new BaseApiClient(
  new ElectronStorageAdapter(),
  new WebRequestAdapter(),
  API_BASE_URL
);

// 初始化（从存储中加载 token）
apiClient.init();

/**
 * 导出 API 服务实例
 * 兼容旧的 apiService 命名
 */
export const apiService = apiClient;
export default apiClient;

/**
 * 快捷方法导出（可选）
 * 方便直接调用，无需通过 apiService
 */
export const { login, logout, register, getCurrentUser, isAuthenticated, getToken, getUser } =
  apiClient;

/**
 * 导出 User 类型（兼容性）
 */
export type { User } from '@lyricnote/shared';
