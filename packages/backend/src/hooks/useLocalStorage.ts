/**
 * 优化的 localStorage Hook
 * 
 * 优点：
 * 1. 异步读取，不阻塞渲染
 * 2. 统一的错误处理
 * 3. 类型安全
 * 4. 自动同步到其他标签页
 */

import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void, () => void] {
  const [value, setValue] = useState<T>(defaultValue)
  const [loading, setLoading] = useState(true)

  // 初始化时从 localStorage 读取
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        setValue(JSON.parse(stored))
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    } finally {
      setLoading(false)
    }
  }, [key])

  // 更新值并同步到 localStorage
  const updateValue = useCallback(
    (newValue: T) => {
      try {
        setValue(newValue)
        localStorage.setItem(key, JSON.stringify(newValue))
        
        // 触发自定义事件，同步到其他标签页
        window.dispatchEvent(
          new CustomEvent('local-storage-change', {
            detail: { key, value: newValue }
          })
        )
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key]
  )

  // 删除值
  const removeValue = useCallback(() => {
    try {
      setValue(defaultValue)
      localStorage.removeItem(key)
      
      window.dispatchEvent(
        new CustomEvent('local-storage-change', {
          detail: { key, value: null }
        })
      )
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, defaultValue])

  // 监听其他标签页的更改
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error('Error parsing storage event:', error)
        }
      }
    }

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail.key === key) {
        setValue(customEvent.detail.value ?? defaultValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('local-storage-change', handleCustomEvent)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('local-storage-change', handleCustomEvent)
    }
  }, [key, defaultValue])

  return [value, updateValue, removeValue]
}

