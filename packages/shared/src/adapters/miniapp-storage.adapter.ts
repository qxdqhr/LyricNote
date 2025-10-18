import type { StorageAdapter } from '../api/storage-adapter'

/**
 * Taro Storage 接口定义
 * 兼容 @tarojs/taro Storage API
 */
interface TaroStorageStatic {
  getStorageSync(key: string): string
  setStorageSync(key: string, value: string): void
  removeStorageSync(key: string): void
  clearStorageSync(): void
}

/**
 * Miniapp 平台存储适配器
 * 基于 Taro Storage API
 * 
 * 使用方式：
 * ```typescript
 * import Taro from '@tarojs/taro'
 * const adapter = new MiniappStorageAdapter(Taro)
 * ```
 * 
 * 适用平台：
 * - WeChat Miniapp
 * - Other Taro-based miniapps
 */
export class MiniappStorageAdapter implements StorageAdapter {
  private storage: TaroStorageStatic

  constructor(taro: TaroStorageStatic) {
    if (!taro) {
      throw new Error('MiniappStorageAdapter requires Taro instance')
    }
    this.storage = taro
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const value = this.storage.getStorageSync(key)
      return value || null
    } catch (error) {
      console.error('[MiniappStorageAdapter] getItem error:', error)
      return null
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      this.storage.setStorageSync(key, value)
    } catch (error) {
      console.error('[MiniappStorageAdapter] setItem error:', error)
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      this.storage.removeStorageSync(key)
    } catch (error) {
      console.error('[MiniappStorageAdapter] removeItem error:', error)
    }
  }

  async clear(): Promise<void> {
    try {
      this.storage.clearStorageSync()
    } catch (error) {
      console.error('[MiniappStorageAdapter] clear error:', error)
    }
  }
}

