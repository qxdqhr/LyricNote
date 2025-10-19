'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Mail, Lock, Eye, EyeOff, TestTube, Zap, Info, Copy } from 'lucide-react'
import { APP_TITLES, APP_CONFIG, useAuth, type Analytics, getWebAdminAnalytics } from '@lyricnote/shared'
import { apiClient } from '@/lib/auth/api-client'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isDevelopment, setIsDevelopment] = useState(false)
  const [autoFilled, setAutoFilled] = useState(false)
  const [analytics] = useState<Analytics>(() => getWebAdminAnalytics())
  const router = useRouter()
  
  // 使用统一的 useAuth Hook
  const { user, isLoggedIn, loading: isLoading, error: authError, login, clearError } = useAuth(apiClient)
  
  // 本地错误状态
  const [localError, setLocalError] = useState('')
  const error = authError || localError

  // 检查登录状态
  useEffect(() => {
    if (isLoggedIn && user) {
      // 检查用户角色权限
      if (['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
        console.log('用户已登录，跳转到管理后台')
        router.push('/admin/config')
        router.refresh()
      }
    }
  }, [isLoggedIn, user, router])

  // 检测开发环境和初始化
  useEffect(() => {
    const isDevEnv = process.env.NODE_ENV === 'development' || 
                     window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1' ||
                     window.location.port === '3000' ||
                     window.location.port === '3004'
    setIsDevelopment(isDevEnv)
    
    // 记录页面访问埋点
    analytics.track('page_view', {
      pageName: 'admin_login_page',
      pageUrl: window.location.pathname,
    })
    
    // 开发环境下自动填充（可选）
    if (isDevEnv && !email && !password) {
      // 延迟自动填充，给用户一个选择的机会
      const timer = setTimeout(() => {
        if (!email && !password) {
          setEmail('admin@lyricnote.local')
          setPassword('admin123')
          setAutoFilled(true)
        }
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 手动填充测试账户信息
  const fillTestAccount = () => {
    setEmail('admin@lyricnote.local')
    setPassword('admin123')
    setLocalError('')
    setAutoFilled(true)
  }

  // 复制测试账户信息
  const copyTestCredentials = async () => {
    const credentials = `邮箱: admin@lyricnote.local\n密码: admin123`
    try {
      await navigator.clipboard.writeText(credentials)
      // 可以添加一个临时的成功提示
    } catch (err) {
      console.log('复制失败，请手动复制')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    clearError()

    try {
      // 使用统一的 login 方法
      const result = await login(email, password)

      if (!result.success) {
        console.error('登录失败:', result.error)
        setLocalError(result.error || '登录失败')
        
        // 记录登录失败埋点
        analytics?.track('user_login_failed', {
          errorType: 'login_error',
          email: email,
          errorMessage: result.error,
        })
        return
      }

      // 登录成功后，user 会通过 useAuth 自动更新
      // 检查将在 useEffect 中处理
      
    } catch (err) {
      console.error('Login error:', err)
      setLocalError('登录失败：网络错误或服务器错误')
      
      // 记录登录异常埋点
      analytics?.track('user_login_error', {
        errorType: 'network_or_server_error',
        errorMessage: err instanceof Error ? err.message : String(err),
        email: email,
      })
    }
  }
  
  // 监听用户登录后的角色检查和埋点
  useEffect(() => {
    if (user && isLoggedIn) {
      // 检查用户角色权限
      if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
        setLocalError('访问被拒绝：需要管理员权限')
        
        // 记录权限拒绝埋点
        analytics?.track('login_permission_denied', {
          email: user.email,
          userRole: user.role,
          requiredRole: 'ADMIN or SUPER_ADMIN',
        })
        
        return
      }

      console.log('登录成功，用户信息:', user.email, user.role)
      
      // 记录登录成功埋点（客户端）
      analytics?.track('user_login_success', {
        userId: user.id,
        email: user.email,
        userRole: user.role,
        loginMethod: 'email_password',
        loginPage: 'admin_login',
      })
      
      // 设置用户信息到埋点 SDK
      analytics?.setUser({
        userId: user.id,
        email: user.email,
        role: user.role,
      })
    }
  }, [user, isLoggedIn, analytics])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* 头部 */}
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-3xl">🎌</span>
            </div>
            {/* 开发环境标识 */}
            {isDevelopment && (
              <Badge 
                variant="outline" 
                className="absolute -top-2 -right-8 bg-orange-100 text-orange-700 border-orange-300 text-xs px-2 py-1"
              >
                <Zap className="w-3 h-3 mr-1" />
                DEV
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {APP_TITLES.admin}
            {isDevelopment && (
              <span className="text-lg text-orange-600 ml-2 font-normal">
                开发环境
              </span>
            )}
          </h1>
          <p className="text-gray-600">
            {APP_CONFIG.description}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Powered by Better Auth
          </p>
          {autoFilled && (
            <p className="text-xs text-green-600 mt-1 font-medium">
              ✨ 已自动填充测试账户信息
            </p>
          )}
        </div>

        {/* 登录表单 */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center">管理员登录</CardTitle>
            <CardDescription className="text-center">
              请使用管理员账户登录系统
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 错误提示 */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* 邮箱输入 */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  管理员邮箱
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@lyricnote.local"
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* 密码输入 */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* 开发环境：测试账户操作 */}
              {isDevelopment && (
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      onClick={fillTestAccount}
                      variant="outline"
                      className="flex-1 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
                      disabled={isLoading}
                    >
                      <TestTube className="mr-2 h-4 w-4" />
                      填充测试账户
                    </Button>
                    <Button
                      type="button"
                      onClick={copyTestCredentials}
                      variant="outline"
                      size="sm"
                      className="border-dashed border-green-300 text-green-600 hover:bg-green-50 px-3"
                      disabled={isLoading}
                      title="复制测试账户信息"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  {autoFilled && (
                    <div className="text-center">
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        <Info className="w-3 h-3 mr-1" />
                        测试账户已填充，可直接登录
                      </Badge>
                    </div>
                  )}
                </div>
              )}

              {/* 登录按钮 */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    登录中...
                  </>
                ) : (
                  '登录管理后台'
                )}
              </Button>
            </form>

            {/* 底部信息 */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-500">
                仅限管理员访问 • 系统安全保护
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                <span>{APP_TITLES.withVersion}</span>
                <span>•</span>
                <span>{APP_CONFIG.description}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 开发环境提示 */}
        {isDevelopment && (
          <Card className="border-dashed border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <p className="text-sm text-amber-800 font-medium">
                    开发环境 - 测试模式
                  </p>
                </div>
                
                <div className="bg-white/60 rounded-lg p-3 text-left">
                  <p className="text-xs text-amber-700 font-medium mb-2">📋 测试账户信息:</p>
                  <div className="space-y-1 text-xs text-amber-800 font-mono">
                    <div className="flex justify-between">
                      <span>邮箱:</span>
                      <span>admin@lyricnote.local</span>
                    </div>
                    <div className="flex justify-between">
                      <span>密码:</span>
                      <span>admin123</span>
                    </div>
                    <div className="flex justify-between">
                      <span>角色:</span>
                      <span>超级管理员</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-4 text-xs text-amber-600">
                  <span>🔄 自动填充: 2秒后</span>
                  <span>•</span>
                  <span>🚀 快速登录</span>
                  <span>•</span>
                  <span>📋 一键复制</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
