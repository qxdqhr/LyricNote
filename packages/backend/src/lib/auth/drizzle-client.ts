// Drizzle 认证客户端
export class DrizzleAuthClient {
  private baseURL: string

  constructor(baseURL = '/api/auth') {
    this.baseURL = baseURL
  }

  // 用户登录
  async signIn(email: string, password: string) {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '登录失败')
      }

      // 保存 token 到 localStorage（用于客户端状态管理）
      if (data.data?.token) {
        localStorage.setItem('auth-token', data.data.token)
        localStorage.setItem('auth-user', JSON.stringify(data.data.user))
        return { data: data.data, error: null }
      }

      return { data: null, error: '登录响应格式错误' }
    } catch (error) {
      console.error('登录错误:', error)
      return { data: null, error: (error as any).message || '登录失败' }
    }
  }

  // 用户注册
  async signUp(email: string, password: string, username?: string) {
    try {
      const response = await fetch(`${this.baseURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '注册失败')
      }

      // 保存 token 到 localStorage
      if (data.data?.token) {
        localStorage.setItem('auth-token', data.data.token)
        localStorage.setItem('auth-user', JSON.stringify(data.data.user))
        return { data: data.data, error: null }
      }

      return { data: null, error: '注册响应格式错误' }
    } catch (error) {
      console.error('注册错误:', error)
      return { data: null, error: (error as any).message || '注册失败' }
    }
  }

  // 获取当前会话
  async getSession() {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        return { data: null, error: '未找到认证令牌' }
      }

      const response = await fetch(`${this.baseURL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        // 如果 token 无效，清除本地存储
        if (response.status === 401) {
          this.signOut()
        }
        throw new Error(data.error || '获取会话失败')
      }

      return { data: data.data, error: null }
    } catch (error) {
      console.error('获取会话错误:', error)
      return { data: null, error: (error as any).message || '获取会话失败' }
    }
  }

  // 用户登出
  async signOut() {
    try {
      const token = localStorage.getItem('auth-token')
      
      // 调用服务器端登出 API
      if (token) {
        await fetch(`${this.baseURL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      }

      // 清除本地存储
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-user')

      return { data: { success: true }, error: null }
    } catch (error) {
      console.error('登出错误:', error)
      // 即使服务器端登出失败，也要清除本地存储
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-user')
      return { data: { success: true }, error: null }
    }
  }

  // 检查是否已登录
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth-token')
  }

  // 获取当前用户信息（从本地存储）
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('auth-user')
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error('获取用户信息错误:', error)
      return null
    }
  }

  // 获取 token
  getToken(): string | null {
    return localStorage.getItem('auth-token')
  }
}

// 创建全局实例
export const drizzleAuthClient = new DrizzleAuthClient()

// 导出便捷方法
export const {
  signIn,
  signUp,
  getSession,
  signOut,
  isAuthenticated,
  getCurrentUser,
  getToken
} = drizzleAuthClient
