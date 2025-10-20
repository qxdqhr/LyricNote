/**
 * 平台适配器统一导出
 * 
 * 提供各平台的存储和网络请求适配器实现
 */

// ==================== 存储适配器 ====================
export { 
  WebStorageAdapter,
  ReactNativeStorageAdapter,
  MiniAppStorageAdapter,
  ElectronStorageAdapter
} from './storage'

export type { StorageAdapter, StorageChangeEvent } from './storage'

// Web 平台网络请求适配器
export { WebRequestAdapter as WebRequestAdapter } from './request/web-request.adapter'

// Miniapp 平台网络请求适配器
export { MiniappRequestAdapter as ApiMiniappRequestAdapter } from './request/miniapp-request.adapter'

// 类型导出
// ApiStorageAdapter 已废弃，直接使用 StorageAdapter
// export type { StorageAdapter as ApiStorageAdapter } from './storage'
export type { RequestAdapter as ApiRequestAdapter, RequestConfig as ApiRequestConfig } from './request/request-adapter'
