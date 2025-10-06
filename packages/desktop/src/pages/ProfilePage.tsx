import React, { useState, useEffect } from 'react'
import { apiService, User } from '../services/api'

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLogin, setIsLogin] = useState(true) // true: 登录模式, false: 注册模式
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // 表单数据
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setCheckingAuth(true)
      const isAuth = await apiService.isAuthenticated()
      
      if (isAuth) {
        const response = await apiService.getCurrentUser()
        if (response.success && response.data) {
          setUser(response.data.user)
          setIsLoggedIn(true)
        } else {
          await apiService.clearUserData()
        }
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
      await apiService.clearUserData()
    } finally {
      setCheckingAuth(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      alert('请输入邮箱和密码')
      return
    }

    setLoading(true)
    try {
      const response = await apiService.login(email, password)
      
      if (response.success && response.data) {
        setUser(response.data.user)
        setIsLoggedIn(true)
        setEmail('')
        setPassword('')
        alert('登录成功！')
      } else {
        alert(response.error || '登录失败')
      }
    } catch (error) {
      alert('登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password || !username) {
      alert('请填写所有字段')
      return
    }

    if (password.length < 6) {
      alert('密码长度至少6位')
      return
    }

    setLoading(true)
    try {
      const response = await apiService.register(email, password, username)
      
      if (response.success && response.data) {
        setUser(response.data.user)
        setIsLoggedIn(true)
        setEmail('')
        setPassword('')
        setUsername('')
        alert('注册成功！')
      } else {
        alert(response.error || '注册失败')
      }
    } catch (error) {
      alert('注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (!confirm('确定要退出登录吗？')) {
      return
    }

    setLoading(true)
    try {
      await apiService.logout()
      setUser(null)
      setIsLoggedIn(false)
      alert('已退出登录')
    } catch (error) {
      alert('登出失败')
    } finally {
      setLoading(false)
    }
  }

  // 加载中状态
  if (checkingAuth) {
    return (
      <div className="page profile-page loading">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  // 已登录状态
  if (isLoggedIn && user) {
    return (
      <div className="page profile-page logged-in">
        <div className="page-header">
          <h1 className="page-title">我的</h1>
        </div>

        <div className="page-content">
          <div className="user-info">
            <div className="avatar-large">
              {user.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <h2 className="username">{user.username}</h2>
            <p className="email">{user.email}</p>
            {user.role && (
              <div className="role-badge">
                {user.role === 'ADMIN' ? '管理员' : user.role === 'SUPER_ADMIN' ? '超级管理员' : '普通用户'}
              </div>
            )}
          </div>

          <button 
            className="logout-btn"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? '处理中...' : '退出登录'}
          </button>
        </div>
      </div>
    )
  }

  // 未登录状态 - 登录/注册表单
  return (
    <div className="page profile-page">
      <div className="page-header">
        <h1 className="page-title">我的</h1>
      </div>

      <div className="page-content">
        <div className="auth-container">
          {/* 切换登录/注册 */}
          <div className="auth-tabs">
            <button
              className={`tab ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              登录
            </button>
            <button
              className={`tab ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              注册
            </button>
          </div>

          {/* 表单 */}
          <form className="auth-form" onSubmit={isLogin ? handleLogin : handleRegister}>
            {!isLogin && (
              <div className="form-group">
                <label>用户名</label>
                <input
                  type="text"
                  placeholder="请输入用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label>邮箱</label>
              <input
                type="email"
                placeholder="请输入邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>密码</label>
              <input
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
            </button>

            <p className="hint">
              {isLogin ? '还没有账号？' : '已有账号？'}
              <button
                type="button"
                className="link"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? ' 立即注册' : ' 立即登录'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

