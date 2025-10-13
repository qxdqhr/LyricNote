import { useState, useEffect, useCallback } from 'react'
import type { User } from '../types'
import type { BaseApiClient } from '../api/base-api-client'

/**
 * 登录表单数据接口
 */
export interface LoginFormData {
  email: string
  password: string
}

/**
 * 注册表单数据接口
 */
export interface RegisterFormData {
  email: string
  password: string
  username: string
}

/**
 * 认证操作结果接口
 */
export interface AuthResult {
  success: boolean
  error?: string
}

/**
 * useAuth Hook 返回值接口
 */
export interface UseAuthReturn {
  // 状态
  user: User | null
  isLoggedIn: boolean
  loading: boolean
  checkingAuth: boolean
  error: string | null
  
  // 操作方法
  login: (email: string, password: string) => Promise<AuthResult>
  register: (email: string, password: string, username: string) => Promise<AuthResult>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  clearError: () => void
}

/**
 * 统一的认证 Hook
 * 
 * 用于管理用户认证状态和操作，消除各端重复的登录逻辑
 * 
 * @param apiClient - API 客户端实例
 * @returns 认证状态和操作方法
 * 
 * @example
 * ```typescript
 * import { useAuth } from '@lyricnote/shared/hooks/useAuth'
 * import { apiService } from '@/services/api'
 * 
 * function ProfilePage() {
 *   const { user, isLoggedIn, loading, login, logout } = useAuth(apiService)
 *   
 *   const handleLogin = async () => {
 *     const result = await login(email, password)
 *     if (result.success) {
 *       alert('登录成功')
 *     } else {
 *       alert(result.error)
 *     }
 *   }
 *   
 *   // ... UI 渲染
 * }
 * ```
 */
export function useAuth(apiClient: BaseApiClient): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * 检查认证状态
   */
  const checkAuthStatus = useCallback(async () => {
    try {
      setCheckingAuth(true)
      setError(null)
      
      const isAuth = await apiClient.isAuthenticated()
      
      if (isAuth) {
        // 验证 token 并获取用户信息
        const response = await apiClient.getCurrentUser()
        
        if (response.success && response.data) {
          setUser(response.data)
          setIsLoggedIn(true)
        } else {
          // Token 无效，清除登录状态
          await apiClient.clearUserData()
          setUser(null)
          setIsLoggedIn(false)
        }
      } else {
        setUser(null)
        setIsLoggedIn(false)
      }
    } catch (err) {
      console.error('检查登录状态失败:', err)
      setError(err instanceof Error ? err.message : '检查登录状态失败')
      setUser(null)
      setIsLoggedIn(false)
    } finally {
      setCheckingAuth(false)
    }
  }, [apiClient])

  /**
   * 用户登录
   */
  const login = useCallback(async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiClient.login(email, password)
      
      if (response.success && response.data) {
        setUser(response.data.user)
        setIsLoggedIn(true)
        return { success: true }
      } else {
        const errorMsg = response.error || '登录失败'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '登录失败，请重试'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [apiClient])

  /**
   * 用户注册
   */
  const register = useCallback(async (
    email: string,
    password: string,
    username: string
  ): Promise<AuthResult> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiClient.register(email, password, username)
      
      if (response.success && response.data) {
        setUser(response.data.user)
        setIsLoggedIn(true)
        return { success: true }
      } else {
        const errorMsg = response.error || '注册失败'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '注册失败，请重试'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [apiClient])

  /**
   * 用户登出
   */
  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      await apiClient.logout()
      setUser(null)
      setIsLoggedIn(false)
    } catch (err) {
      console.error('登出失败:', err)
      setError(err instanceof Error ? err.message : '登出失败')
      // 即使登出失败，也清除本地状态
      setUser(null)
      setIsLoggedIn(false)
    } finally {
      setLoading(false)
    }
  }, [apiClient])

  /**
   * 清除错误信息
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // 组件挂载时检查认证状态
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  return {
    // 状态
    user,
    isLoggedIn,
    loading,
    checkingAuth,
    error,
    
    // 操作方法
    login,
    register,
    logout,
    refresh: checkAuthStatus,
    clearError
  }
}

/**
 * 表单验证 Hook
 * 
 * @example
 * ```typescript
 * const { values, errors, handleChange, handleBlur, validate } = useAuthForm({
 *   email: '',
 *   password: ''
 * })
 * ```
 */
export function useAuthForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues((prev: T) => ({ ...prev, [field]: value }))
    // 清除该字段的错误
    if (errors[field]) {
      setErrors((prev: Partial<Record<keyof T, string>>) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [errors])

  const handleBlur = useCallback((field: keyof T) => {
    setTouched((prev: Partial<Record<keyof T, boolean>>) => ({ ...prev, [field]: true }))
  }, [])

  const validate = useCallback((validationRules: Partial<Record<keyof T, (value: any) => string | undefined>>) => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    
    Object.keys(validationRules).forEach(key => {
      const field = key as keyof T
      const rule = validationRules[field]
      if (rule) {
        const error = rule(values[field])
        if (error) {
          newErrors[field] = error
        }
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [values])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setValues,
    setErrors
  }
}

