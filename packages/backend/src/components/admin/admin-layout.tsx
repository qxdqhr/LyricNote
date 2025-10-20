'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Sidebar } from './sidebar'
import { Button } from '@/components/ui/button'
import { Bell, Search, Settings } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/lib/auth/api-client'
import { APP_CONFIG, useAuth, type Analytics, getWebAdminAnalytics } from '@lyricnote/shared'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [analytics] = useState<Analytics>(() => getWebAdminAnalytics())
  const router = useRouter()
  const pathname = usePathname()
  
  // 使用统一的 useAuth Hook
  const { user, isLoggedIn, checkingAuth: loading } = useAuth(apiClient)

  // 检查认证状态和权限
  useEffect(() => {
    if (!loading && analytics) {
      if (!isLoggedIn || !user) {
        router.push('/admin/login')
        return
      }

      // 检查管理员权限
      if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
        console.error('权限不足:', user.role)
        router.push('/admin/login')
        return
      }

      // 设置用户信息到埋点
      analytics.setUser({
        userId: user.id,
        email: user.email || '',
        role: user.role,
      })
      
      // 记录进入管理员界面埋点
      analytics.track('admin_dashboard_entered', {
        userId: user.id,
        userRole: user.role,
        entryPath: window.location.pathname,
        entryTime: new Date().toISOString(),
      })
    }
  }, [loading, isLoggedIn, user, router, analytics])

  // 页面切换埋点
  useEffect(() => {
    if (user && analytics && pathname) {
      analytics.track('admin_page_view', {
        pagePath: pathname,
        pageTitle: getPageTitle(),
        userId: user.id,
        userRole: user.role,
      })
    }
  }, [pathname, user, analytics])

  // 获取页面标题
  const getPageTitle = () => {
    if (pathname === '/admin/config') return '系统配置'
    if (pathname === '/admin/users') return '用户管理'
    if (pathname === '/admin/songs') return '歌曲管理'
    if (pathname === '/admin/lyrics') return '歌词管理'
    if (pathname === '/admin/analytics') return '数据分析'
    if (pathname === '/admin/logs') return '系统日志'
    if (pathname === '/admin/backup') return '数据备份'
    if (pathname === '/admin/monitoring') return '性能监控'
    return '管理后台'
  }

  const getPageDescription = () => {
    if (pathname === '/admin/config') return '动态配置管理，实时修改系统设置'
    if (pathname === '/admin/users') return '管理用户账户、权限和个人信息'
    if (pathname === '/admin/songs') return '管理歌曲库、元数据和分类'
    if (pathname === '/admin/lyrics') return '审核、编辑和管理歌词内容'
    if (pathname === '/admin/analytics') return '用户行为分析和系统使用统计'
    if (pathname === '/admin/logs') return '查看系统操作日志和错误记录'
    if (pathname === '/admin/backup') return '数据备份、恢复和维护工具'
    if (pathname === '/admin/monitoring') return '系统性能监控和健康状态'
    return '系统管理和配置中心'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-sm">🎌</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* 侧边栏 */}
      <Suspense fallback={
        <div className="w-64 bg-white border-r border-gray-200 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      }>
        <Sidebar user={user} />
      </Suspense>
      
      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
              <p className="text-sm text-gray-600 mt-1">{getPageDescription()}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* 搜索 */}
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Search className="h-4 w-4" />
              </Button>
              
              {/* 通知 */}
              <div className="relative">
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <Bell className="h-4 w-4" />
                </Button>
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                >
                  3
                </Badge>
              </div>
              
              {/* 快速设置 */}
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Settings className="h-4 w-4" />
              </Button>
              
              {/* 用户头像 */}
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    {user.nickname?.[0] || user.username?.[0] || user.email[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user.nickname || user.username || user.email}
                  </p>
                  <p className="text-xs text-gray-500">{user.role === 'SUPER_ADMIN' ? '超级管理员' : '管理员'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* 页面内容 - 可滚动 */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        
        {/* 底部状态栏 */}
        <footer className="bg-white border-t border-gray-200 px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>{APP_CONFIG.copyright}</span>
              <span>v{APP_CONFIG.version}</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>系统正常运行</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span>域名: {typeof window !== 'undefined' ? window.location.hostname : 'qhr062.top'}</span>
              <span>最后更新: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
