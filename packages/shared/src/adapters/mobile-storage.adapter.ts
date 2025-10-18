import type { StorageAdapter } from '../api/storage-adapter'

/**
 * AsyncStorage 接口定义
 * 兼容 @react-native-async-storage/async-storage
 */
interface AsyncStorageStatic {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  removeItem(key: string): Promise<void>
  clear(): Promise<void>
}

/**
 * Mobile 平台存储适配器
 * 基于 React Native AsyncStorage
 * 
 * 使用方式：
 * ```typescript
 * import AsyncStorage from '@react-native-async-storage/async-storage'
 * const adapter = new MobileStorageAdapter(AsyncStorage)
 * ```
 * 
 * 适用平台：
 * - Mobile (React Native / Expo)
 */
export class MobileStorageAdapter implements StorageAdapter {
  private storage: AsyncStorageStatic

  constructor(asyncStorage: AsyncStorageStatic) {
    if (!asyncStorage) {
      throw new Error('MobileStorageAdapter requires AsyncStorage instance')
    }
    this.storage = asyncStorage
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return await this.storage.getItem(key)
    } catch (error) {
      console.error('[MobileStorageAdapter] getItem error:', error)
      return null
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await this.storage.setItem(key, value)
    } catch (error) {
      console.error('[MobileStorageAdapter] setItem error:', error)
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await this.storage.removeItem(key)
    } catch (error) {
      console.error('[MobileStorageAdapter] removeItem error:', error)
    }
  }

  async clear(): Promise<void> {
    try {
      await this.storage.clear()
    } catch (error) {
      console.error('[MobileStorageAdapter] clear error:', error)
    }
  }
}

