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

// Web ,  Miniapp 平台网络请求适配器
export { MiniappRequestAdapter , WebRequestAdapter,RequestAdapter, RequestConfig} from './request'

