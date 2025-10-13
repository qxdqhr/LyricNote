import AsyncStorage from '@react-native-async-storage/async-storage'
import type { StorageAdapter } from '@lyricnote/shared'
import { logger } from '../lib/logger'

/**
 * Mobile 平台存储适配器
 * 基于 React Native AsyncStorage
 */
export class MobileStorageAdapter implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key)
    } catch (error) {
      logger.error('AsyncStorage getItem error', error instanceof Error ? error : new Error(String(error)))
      return null
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (error) {
      logger.error('AsyncStorage setItem error', error instanceof Error ? error : new Error(String(error)))
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error) {
      logger.error('AsyncStorage removeItem error', error instanceof Error ? error : new Error(String(error)))
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear()
    } catch (error) {
      logger.error('AsyncStorage clear error', error instanceof Error ? error : new Error(String(error)))
    }
  }
}

