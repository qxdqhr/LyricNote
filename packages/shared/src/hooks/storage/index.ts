/**
 * 存储 Hooks 导出
 */

// 类型定义 - 不导出 StorageAdapter 避免冲突
export type { StorageChangeEvent } from './types'

// 适配器
export * from './adapters'

// 通用 Hook
export { useStorage } from './useStorage'

// 平台特定 Hook
export { useLocalStorage } from './useLocalStorage'
export { useAsyncStorage } from './useAsyncStorage'
export { useTaroStorage } from './useTaroStorage'

