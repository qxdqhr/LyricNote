/**
 * API 平台适配器统一导出
 * 
 * 提供各平台的存储和网络请求适配器实现
 * 注意：这些适配器用于 API 认证，与 Analytics 适配器分离
 */

// Web 平台适配器（适用于 Web 和 Desktop）
export { WebStorageAdapter as ApiWebStorageAdapter } from './web-storage.adapter'
export { WebRequestAdapter as ApiWebRequestAdapter } from './web-request.adapter'

// Mobile 平台适配器
export { MobileStorageAdapter as ApiMobileStorageAdapter } from './mobile-storage.adapter'

// Miniapp 平台适配器
export { MiniappStorageAdapter as ApiMiniappStorageAdapter } from './miniapp-storage.adapter'
export { MiniappRequestAdapter as ApiMiniappRequestAdapter } from './miniapp-request.adapter'

// 类型导出
export type { StorageAdapter as ApiStorageAdapter } from '../api/storage-adapter'
export type { RequestAdapter as ApiRequestAdapter, RequestConfig as ApiRequestConfig } from '../api/request-adapter'

