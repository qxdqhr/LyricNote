/**
 * 存储适配器接口
 * 用于抽象不同平台的本地存储实现
 * - Mobile: AsyncStorage
 * - Miniapp: Taro.Storage
 * - Desktop: localStorage
 */
export interface StorageAdapter {
  /**
   * 获取存储的值
   * @param key 存储键
   * @returns 存储的值，不存在则返回 null
   */
  getItem(key: string): Promise<string | null>

  /**
   * 设置存储的值
   * @param key 存储键
   * @param value 要存储的值
   */
  setItem(key: string, value: string): Promise<void>

  /**
   * 删除存储的值
   * @param key 存储键
   */
  removeItem(key: string): Promise<void>

  /**
   * 清空所有存储
   */
  clear?(): Promise<void>
}

