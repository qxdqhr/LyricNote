import { useState, useEffect } from 'react'
import { View, Text, Button, Input } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { apiService } from '../../services/api'
import './index.scss'

interface User {
  id: string
  email: string
  username: string
  nickname?: string
  role: string
}

export default function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLogin, setIsLogin] = useState(true) // true: 登录模式, false: 注册模式
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // 表单数据
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  useLoad(() => {
    console.log('Profile page loaded.')
    checkAuthStatus()
  })

  const checkAuthStatus = async () => {
    try {
      setCheckingAuth(true)
      const isAuth = await apiService.isAuthenticated()
      
      if (isAuth) {
        // 验证 token 并获取用户信息
        const response = await apiService.getCurrentUser()
        if (response.success && response.data) {
          setUser(response.data.user)
          setIsLoggedIn(true)
        } else {
          // Token 无效，清除登录状态
          await apiService.clearUserData()
        }
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
      // 出错时也清除可能无效的数据
      await apiService.clearUserData()
    } finally {
      setCheckingAuth(false)
    }
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Taro.showToast({ title: '请输入邮箱和密码', icon: 'none' })
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
        Taro.showToast({ title: '登录成功！', icon: 'success' })
      } else {
        Taro.showToast({ title: response.error || '登录失败', icon: 'none' })
      }
    } catch (error) {
      Taro.showToast({ title: '登录失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!email || !password || !username) {
      Taro.showToast({ title: '请填写所有字段', icon: 'none' })
      return
    }

    if (password.length < 6) {
      Taro.showToast({ title: '密码长度至少6位', icon: 'none' })
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
        Taro.showToast({ title: '注册成功！', icon: 'success' })
      } else {
        Taro.showToast({ title: response.error || '注册失败', icon: 'none' })
      }
    } catch (error) {
      Taro.showToast({ title: '注册失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const res = await Taro.showModal({
      title: '确认登出',
      content: '确定要退出登录吗？'
    })

    if (res.confirm) {
      setLoading(true)
      try {
        await apiService.logout()
        setUser(null)
        setIsLoggedIn(false)
        Taro.showToast({ title: '已退出登录', icon: 'success' })
      } catch (error) {
        Taro.showToast({ title: '登出失败', icon: 'none' })
      } finally {
        setLoading(false)
      }
    }
  }

  // 加载中状态
  if (checkingAuth) {
    return (
      <View className='profile loading'>
        <Text>加载中...</Text>
      </View>
    )
  }

  // 已登录状态
  if (isLoggedIn && user) {
    return (
      <View className='profile logged-in'>
        <View className='user-info'>
          <View className='avatar'>
            <Text className='avatar-text'>{user.username?.[0]?.toUpperCase() || 'U'}</Text>
          </View>
          <Text className='username'>{user.username}</Text>
          <Text className='email'>{user.email}</Text>
          {user.role && (
            <View className='role-badge'>
              <Text className='role-text'>
                {user.role === 'ADMIN' ? '管理员' : user.role === 'SUPER_ADMIN' ? '超级管理员' : '普通用户'}
              </Text>
            </View>
          )}
        </View>

        <Button 
          className='logout-btn'
          onClick={handleLogout}
          loading={loading}
          disabled={loading}
        >
          退出登录
        </Button>
      </View>
    )
  }

  // 未登录状态 - 登录/注册表单
  return (
    <View className='profile'>
      <View className='auth-tabs'>
        <View 
          className={`tab ${isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(true)}
        >
          <Text>登录</Text>
        </View>
        <View 
          className={`tab ${!isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(false)}
        >
          <Text>注册</Text>
        </View>
      </View>

      <View className='form'>
        {!isLogin && (
          <View className='input-group'>
            <Text className='label'>用户名</Text>
            <Input
              className='input'
              placeholder='请输入用户名'
              value={username}
              onInput={(e) => setUsername(e.detail.value)}
            />
          </View>
        )}

        <View className='input-group'>
          <Text className='label'>邮箱</Text>
          <Input
            className='input'
            type='text'
            placeholder='请输入邮箱'
            value={email}
            onInput={(e) => setEmail(e.detail.value)}
          />
        </View>

        <View className='input-group'>
          <Text className='label'>密码</Text>
          <Input
            className='input'
            password
            placeholder='请输入密码'
            value={password}
            onInput={(e) => setPassword(e.detail.value)}
          />
        </View>

        <Button
          className='submit-btn'
          onClick={isLogin ? handleLogin : handleRegister}
          loading={loading}
          disabled={loading}
        >
          {isLogin ? '登录' : '注册'}
        </Button>

        <View className='hint'>
          <Text>{isLogin ? '还没有账号？' : '已有账号？'}</Text>
          <Text className='link' onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? ' 立即注册' : ' 立即登录'}
          </Text>
        </View>
      </View>
    </View>
  )
}


