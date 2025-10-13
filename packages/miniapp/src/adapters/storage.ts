import Taro from '@tarojs/taro'
import type { StorageAdapter } from '@lyricnote/shared'
import { logger } from '../lib/logger'

/**
 * Miniapp 平台存储适配器
 * 基于 Taro Storage API
 */
export class MiniappStorageAdapter implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    try {
      const value = Taro.getStorageSync(key)
      return value || null
    } catch (error) {
      logger.error('Taro.getStorageSync error', error instanceof Error ? error : new Error(String(error)))
      return null
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      Taro.setStorageSync(key, value)
    } catch (error) {
      logger.error('Taro.setStorageSync error', error instanceof Error ? error : new Error(String(error)))
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      Taro.removeStorageSync(key)
    } catch (error) {
      logger.error('Taro.removeStorageSync error', error instanceof Error ? error : new Error(String(error)))
    }
  }

  async clear(): Promise<void> {
    try {
      Taro.clearStorageSync()
    } catch (error) {
      logger.error('Taro.clearStorageSync error', error instanceof Error ? error : new Error(String(error)))
    }
  }
}

