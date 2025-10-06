// API 配置
const API_BASE_URL = 'http://localhost:3000/api'

// 存储 key
const AUTH_TOKEN_KEY = 'auth_token'
const USER_DATA_KEY = 'user_data'

// API 响应类型
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 用户类型
export interface User {
  id: string
  email: string
  username: string
  nickname?: string
  avatar?: string
  role: string
}

// 认证响应类型
interface AuthResponse {
  user: User
  token: string
}

// API 服务类
class ApiService {
  private token: string | null = null

  // 初始化 - 从存储中加载 token
  async init() {
    try {
      this.token = localStorage.getItem(AUTH_TOKEN_KEY)
    } catch (error) {
      console.error('Failed to load token:', error)
    }
  }

  // 设置 token
  async setToken(token: string | null) {
    this.token = token
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    }
  }

  // 获取 token
  getToken(): string | null {
    return this.token
  }

  // 保存用户数据
  async saveUserData(user: User) {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
  }

  // 获取用户数据
  async getUserData(): Promise<User | null> {
    try {
      const data = localStorage.getItem(USER_DATA_KEY)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Failed to load user data:', error)
      return null
    }
  }

  // 清除用户数据
  async clearUserData() {
    localStorage.removeItem(USER_DATA_KEY)
    localStorage.removeItem(AUTH_TOKEN_KEY)
    this.token = null
  }

  // 通用请求方法
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      }

      // 添加认证 token
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || '请求失败',
        }
      }

      return data
    } catch (error) {
      console.error('API request error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '网络错误，请重试',
      }
    }
  }

  // ==================== 认证相关 ====================

  // 用户注册
  async register(email: string, password: string, username: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    })

    if (response.success && response.data) {
      await this.setToken(response.data.token)
      await this.saveUserData(response.data.user)
    }

    return response
  }

  // 用户登录
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    if (response.success && response.data) {
      await this.setToken(response.data.token)
      await this.saveUserData(response.data.user)
    }

    return response
  }

  // 用户登出
  async logout(): Promise<ApiResponse> {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    })

    // 无论是否成功，都清除本地数据
    await this.clearUserData()

    return response
  }

  // 获取当前用户信息
  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.request('/auth/me')
  }

  // 检查是否已登录
  async isAuthenticated(): Promise<boolean> {
    if (!this.token) {
      await this.init()
    }
    return !!this.token
  }

  // ==================== 其他 API ====================

  // 这里可以添加其他 API 方法
  // 例如：识别音乐、获取歌词等
}

// 创建单例实例
export const apiService = new ApiService()

// 初始化
apiService.init()

export default apiService

