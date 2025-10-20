/**
 * API 平台适配器统一导出
 * 
 * 提供各平台的存储和网络请求适配器实现
 * 注意：存储适配器已合并到 hooks/storage/adapters，这里重新导出以保持兼容性
 */

// 从 hooks/storage/adapters 导入存储适配器
export { WebStorageAdapter as ApiWebStorageAdapter } from '../hooks/storage/adapters/web'
export { ReactNativeStorageAdapter as ApiMobileStorageAdapter } from '../hooks/storage/adapters/react-native'
export { MiniAppStorageAdapter as ApiMiniappStorageAdapter } from '../hooks/storage/adapters/miniapp'

// Web 平台网络请求适配器
export { WebRequestAdapter as ApiWebRequestAdapter } from './web-request.adapter'

// Miniapp 平台网络请求适配器
export { MiniappRequestAdapter as ApiMiniappRequestAdapter } from './miniapp-request.adapter'

// 类型导出
export type { StorageAdapter as ApiStorageAdapter } from '../api/storage-adapter'
export type { RequestAdapter as ApiRequestAdapter, RequestConfig as ApiRequestConfig } from '../api/request-adapter'
