/**
 * 配置缓存优化
 * 
 * 使用 SWR 实现智能缓存和自动重新验证
 * 
 * 优点：
 * 1. 自动缓存，减少网络请求
 * 2. 自动重新验证（可配置）
 * 3. 乐观更新
 * 4. 错误重试
 * 5. 防抖和去重
 */

import useSWR, { mutate } from 'swr'
import { useCallback } from 'react'

interface ConfigItem {
  key: string
  value: any
  type: string
  isRequired: boolean
  isSensitive: boolean
  description?: string
  defaultValue?: any
  readonly?: boolean
}

interface AllConfigs {
  [category: string]: {
    [key: string]: ConfigItem
  }
}

// Fetcher 函数
const fetcher = async (url: string) => {
  const token = localStorage.getItem('auth-token')
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  
  if (!res.ok) {
    if (res.status === 401) {
      window.location.href = '/admin/login'
      throw new Error('Unauthorized')
    }
    throw new Error('Failed to fetch configs')
  }
  
  const data = await res.json()
  return data.data as AllConfigs
}

// 自定义 Hook
export function useConfigs() {
  const { data, error, mutate: mutateConfigs } = useSWR<AllConfigs>(
    '/api/admin/config',
    fetcher,
    {
      // 配置选项
      revalidateOnFocus: false,        // 窗口聚焦时不重新验证
      revalidateOnReconnect: true,     // 网络重连时重新验证
      dedupingInterval: 60000,         // 60秒内的重复请求使用缓存
      errorRetryCount: 3,              // 错误重试3次
      errorRetryInterval: 5000,        // 重试间隔5秒
      shouldRetryOnError: true,        // 启用错误重试
      
      // 成功时的回调
      onSuccess: (data) => {
        console.log('✅ Configs loaded from cache or network')
      },
      
      // 错误时的回调
      onError: (error) => {
        console.error('❌ Failed to load configs:', error)
      }
    }
  )

  // 更新配置（乐观更新）
  const updateConfigs = useCallback(
    async (category: string, updates: Record<string, any>) => {
      const token = localStorage.getItem('auth-token')
      
      // 乐观更新：立即更新本地缓存
      mutateConfigs(
        (current) => {
          if (!current) return current
          return {
            ...current,
            [category]: {
              ...current[category],
              ...Object.entries(updates).reduce((acc, [key, value]) => {
                acc[key] = {
                  ...current[category]?.[key],
                  value
                }
                return acc
              }, {} as any)
            }
          }
        },
        false  // 不立即重新验证
      )
      
      try {
        // 发送到服务器
        const res = await fetch(`/api/admin/config/${category}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ configs: updates })
        })
        
        if (!res.ok) throw new Error('Update failed')
        
        // 更新成功，重新验证缓存
        mutateConfigs()
        
        return { success: true }
      } catch (error) {
        // 更新失败，回滚
        mutateConfigs()  // 从服务器重新获取
        throw error
      }
    },
    [mutateConfigs]
  )

  // 手动刷新
  const refresh = useCallback(() => {
    mutateConfigs()
  }, [mutateConfigs])

  return {
    configs: data,
    isLoading: !error && !data,
    isError: !!error,
    error,
    updateConfigs,
    refresh
  }
}

// 策略1：分类级别的缓存
export function useConfigCategory(category: string) {
  const { data, error, mutate } = useSWR(
    `/api/admin/config/${category}`,
    fetcher,
    { dedupingInterval: 30000 }  // 30秒缓存
  )
  
  return {
    configs: data?.[category],
    isLoading: !error && !data,
    error,
    mutate
  }
}

// 策略2：预加载
export function prefetchConfigs() {
  // 提前加载数据到缓存
  mutate('/api/admin/config', fetcher('/api/admin/config'))
}

// 策略3：全局缓存失效
export function invalidateAllConfigs() {
  // 使所有配置缓存失效
  mutate(
    (key) => typeof key === 'string' && key.startsWith('/api/admin/config'),
    undefined,
    { revalidate: true }
  )
}

