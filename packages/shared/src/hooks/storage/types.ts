/**
 * 存储 Hook 相关类型
 * StorageAdapter 接口定义在 api/storage-adapter.ts 中
 */

import type { StorageAdapter as BaseStorageAdapter } from '../../api/storage-adapter'

/**
 * 扩展的存储适配器接口，支持变化监听
 */
export interface StorageAdapter extends BaseStorageAdapter {
  /**
   * 监听存储变化（可选，部分平台支持）
   */
  addChangeListener?(callback: (key: string, value: string | null) => void): () => void
}

/**
 * 存储事件
 */
export interface StorageChangeEvent {
  key: string
  value: any
  oldValue?: any
}
