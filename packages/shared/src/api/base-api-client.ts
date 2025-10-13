import { StorageAdapter } from './storage-adapter'
import { RequestAdapter, RequestConfig } from './request-adapter'
import { API_ENDPOINTS, STORAGE_KEYS } from './endpoints'
import type { ApiResponse, User } from '../types'

/**
 * 认证响应类型
 */
export interface AuthResponse {
  user: User
  token: string
}

/**
 * 基础 API 客户端
 * 提供统一的 API 调用逻辑，通过适配器模式支持多平台
 */
export class BaseApiClient {
  private token: string | null = null
  private user: User | null = null

  constructor(
    private storage: StorageAdapter,
    private request: RequestAdapter,
    private baseUrl: string
  ) {}

  /**
   * 初始化 - 从存储中加载 token 和用户信息
   */
  async init(): Promise<void> {
    try {
      this.token = await this.storage.getItem(STORAGE_KEYS.AUTH_TOKEN)
      const userData = await this.storage.getItem(STORAGE_KEYS.USER_DATA)
      if (userData) {
        this.user = JSON.parse(userData)
      }
    } catch (error) {
      console.error('Failed to load auth data:', error)
    }
  }

  /**
   * 设置认证 token
   */
  async setToken(token: string | null): Promise<void> {
    this.token = token
    if (token) {
      await this.storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    } else {
      await this.storage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    }
  }

  /**
   * 设置用户信息
   */
  async setUser(user: User | null): Promise<void> {
    this.user = user
    if (user) {
      await this.storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user))
    } else {
      await this.storage.removeItem(STORAGE_KEYS.USER_DATA)
    }
  }

  /**
   * 获取当前 token
   */
  getToken(): string | null {
    return this.token
  }

  /**
   * 获取当前用户
   */
  getUser(): User | null {
    return this.user
  }

  /**
   * 检查是否已登录
   */
  isAuthenticated(): boolean {
    return !!this.token
  }

  /**
   * 清除用户数据
   */
  async clearUserData(): Promise<void> {
    await this.storage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    await this.storage.removeItem(STORAGE_KEYS.USER_DATA)
    this.token = null
    this.user = null
  }

  /**
   * 发送请求的通用方法
   */
  private async sendRequest<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(config.headers || {}),
      }

      // 添加认证 token
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`
      }

      const response = await this.request.request<ApiResponse<T>>({
        ...config,
        url: `${this.baseUrl}${config.url}`,
        headers,
      })

      return response
    } catch (error) {
      console.error('API request error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '网络错误，请重试',
      }
    }
  }

  // ==================== 认证相关 API ====================

  /**
   * 用户注册
   */
  async register(
    email: string,
    password: string,
    username: string
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await this.sendRequest<AuthResponse>({
      url: API_ENDPOINTS.AUTH.REGISTER,
      method: 'POST',
      body: { email, password, username },
    })

    if (response.success && response.data) {
      await this.setToken(response.data.token)
      await this.setUser(response.data.user)
    }

    return response
  }

  /**
   * 用户登录
   */
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.sendRequest<AuthResponse>({
      url: API_ENDPOINTS.AUTH.LOGIN,
      method: 'POST',
      body: { email, password },
    })

    if (response.success && response.data) {
      await this.setToken(response.data.token)
      await this.setUser(response.data.user)
    }

    return response
  }

  /**
   * 用户退出登录
   */
  async logout(): Promise<ApiResponse<void>> {
    const response = await this.sendRequest<void>({
      url: API_ENDPOINTS.AUTH.LOGOUT,
      method: 'POST',
    })

    // 无论成功与否，都清除本地数据
    await this.clearUserData()

    return response
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await this.sendRequest<any>({
      url: API_ENDPOINTS.AUTH.ME,
      method: 'GET',
    })

    // 统一处理响应格式：自动展开 response.data.user 为 response.data
    if (response.success && response.data) {
      // 如果 data 是嵌套的 {user: {...}, session: {...}} 格式，提取 user
      const userData = response.data.user || response.data
      
      await this.setUser(userData)
      
      return {
        ...response,
        data: userData
      }
    }

    return response
  }

  // ==================== 用户相关 API ====================

  /**
   * 获取用户列表
   */
  async getUsers(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<ApiResponse<{ users: User[]; total: number }>> {
    return this.sendRequest({
      url: API_ENDPOINTS.USERS.LIST,
      method: 'GET',
      params,
    })
  }

  /**
   * 获取用户详情
   */
  async getUserById(userId: string): Promise<ApiResponse<User>> {
    return this.sendRequest({
      url: API_ENDPOINTS.USERS.DETAIL(userId),
      method: 'GET',
    })
  }

  /**
   * 更新用户信息
   */
  async updateUser(
    userId: string,
    data: Partial<User>
  ): Promise<ApiResponse<User>> {
    return this.sendRequest({
      url: API_ENDPOINTS.USERS.UPDATE(userId),
      method: 'PUT',
      body: data,
    })
  }

  /**
   * 删除用户
   */
  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return this.sendRequest({
      url: API_ENDPOINTS.USERS.DELETE(userId),
      method: 'DELETE',
    })
  }

  // ==================== 通用方法 ====================

  /**
   * 发送 GET 请求
   */
  async get<T = any>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.sendRequest({ url, method: 'GET', params })
  }

  /**
   * 发送 POST 请求
   */
  async post<T = any>(url: string, body?: any): Promise<ApiResponse<T>> {
    return this.sendRequest({ url, method: 'POST', body })
  }

  /**
   * 发送 PUT 请求
   */
  async put<T = any>(url: string, body?: any): Promise<ApiResponse<T>> {
    return this.sendRequest({ url, method: 'PUT', body })
  }

  /**
   * 发送 DELETE 请求
   */
  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.sendRequest({ url, method: 'DELETE' })
  }
}

