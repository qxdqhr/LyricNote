import type { StorageAdapter } from '@lyricnote/shared'
import { logger } from '../lib/logger'

/**
 * Desktop 平台存储适配器
 * 基于浏览器 localStorage API
 */
export class DesktopStorageAdapter implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      logger.error('localStorage getItem error', error instanceof Error ? error : new Error(String(error)))
      return null
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      logger.error('localStorage setItem error', error instanceof Error ? error : new Error(String(error)))
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      logger.error('localStorage removeItem error', error instanceof Error ? error : new Error(String(error)))
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.clear()
    } catch (error) {
      logger.error('localStorage clear error', error instanceof Error ? error : new Error(String(error)))
    }
  }
}

