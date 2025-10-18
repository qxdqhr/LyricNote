import type { StorageAdapter } from '../api/storage-adapter'

/**
 * Web 平台存储适配器
 * 基于浏览器 localStorage API
 * 
 * 适用平台：
 * - Web (Next.js)
 * - Desktop (Electron)
 */
export class WebStorageAdapter implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    try {
      // SSR 环境检查
      if (typeof window === 'undefined') return null
      return localStorage.getItem(key)
    } catch (error) {
      console.error('[WebStorageAdapter] getItem error:', error)
      return null
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (typeof window === 'undefined') return
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('[WebStorageAdapter] setItem error:', error)
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (typeof window === 'undefined') return
      localStorage.removeItem(key)
    } catch (error) {
      console.error('[WebStorageAdapter] removeItem error:', error)
    }
  }

  async clear(): Promise<void> {
    try {
      if (typeof window === 'undefined') return
      localStorage.clear()
    } catch (error) {
      console.error('[WebStorageAdapter] clear error:', error)
    }
  }
}

