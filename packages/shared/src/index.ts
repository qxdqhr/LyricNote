// 导出所有类型
export * from './types'

// 导出所有工具函数
export * from './utils'

// 导出所有常量
export * from './constants'

// 导出 API 层
export * from './api'

// 导出 Hooks
export * from './hooks'

// 导出日志系统
export * from './logger'

// 导出埋点系统
export * from './analytics'

// 导出平台适配器（显式导出以避免冲突）
export {
  // 存储适配器
  WebStorageAdapter,
  ReactNativeStorageAdapter,
  MiniAppStorageAdapter,
  ElectronStorageAdapter,
  // 网络请求适配器
  WebRequestAdapter,
  ApiMiniappRequestAdapter
} from './adapters'

// 导出适配器类型（显式导出以避免冲突）
export type { 
  StorageAdapter,
  StorageChangeEvent,
  ApiRequestAdapter,
  ApiRequestConfig 
} from './adapters'

// 版本信息
export const SHARED_VERSION = '1.0.0'
