'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@lyricnote/shared'
import { apiClient } from '@/lib/auth/api-client'
import { APP_CONFIG, Analytics, webAdapter } from '@lyricnote/shared'
import {
  Settings,
  Users,
  Music,
  FileText,
  BarChart3,
  Database,
  Shield,
  Smartphone,
  Cloud,
  Bot,
  LogOut,
  Menu,
  X,
  Home,
  HardDrive,
  Activity,
  FileSearch
} from 'lucide-react'

// 用户类型定义
type User = {
  id: string
  email: string
  username?: string
  nickname?: string
  role: string
}

interface SidebarProps {
  user?: User
}

interface MenuItem {
  title: string
  icon: any
  href?: string
  description?: string
  badge?: string
  items?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    title: '系统管理',
    icon: Settings,
    items: [
      {
        title: '数据库配置',
        icon: Database,
        href: '/admin/config?category=database',
        description: '数据库连接设置'
      },
      {
        title: '存储配置',
        icon: Cloud,
        href: '/admin/config?category=storage',
        description: 'OSS存储设置'
      },
      {
        title: 'AI服务配置',
        icon: Bot,
        href: '/admin/config?category=ai_service',
        description: 'AI服务配置'
      },
      {
        title: '安全配置',
        icon: Shield,
        href: '/admin/config?category=security',
        description: '安全相关设置'
      },
      {
        title: '移动端配置',
        icon: Smartphone,
        href: '/admin/config?category=mobile',
        description: 'Expo构建配置'
      },
      {
        title: '埋点数据分析',
        icon: BarChart3,
        href: '/admin/config?category=analytics',
        description: '用户行为数据分析'
      },
      {
        title: '开发者调试',
        icon: Settings,
        href: '/admin/config?category=developer',
        description: '日志和埋点输出控制'
      }
    ]
  }
]

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { logout } = useAuth(apiClient)
  const [collapsed, setCollapsed] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['内容管理', '系统管理'])
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // 初始化埋点 SDK
  useEffect(() => {
    const analyticsInstance = new Analytics({
      appId: 'lyricnote-admin',
      serverUrl: '/api/analytics/events',
      platform: 'web',
      adapter: webAdapter,
      enableAutoPageView: true,
      appVersion: '1.0.0',
    })
    
    // 设置用户信息
    if (user) {
      analyticsInstance.setUser({
        userId: user.id,
        email: user.email || '',
        role: user.role,
      })
    }
    
    setAnalytics(analyticsInstance)
  }, [user])

  const handleLogoutClick = () => {
    // 显示确认对话框
    setShowLogoutConfirm(true)
    
    // 记录退出登录按钮点击埋点
    analytics?.track('logout_button_clicked', {
      userId: user?.id,
      userRole: user?.role,
      location: 'sidebar',
    })
  }

  const handleLogoutConfirm = async () => {
    try {
      setIsLoggingOut(true)
      
      // 记录退出登录开始埋点
      analytics?.track('user_logout_initiated', {
        userId: user?.id,
        email: user?.email,
        userRole: user?.role,
        logoutMethod: 'manual',
      })
      
      // 使用统一的 logout 方法
      await logout()
      
      // 记录退出登录成功埋点（客户端）
      analytics?.track('user_logout_success', {
        userId: user?.id,
        email: user?.email,
        userRole: user?.role,
        logoutMethod: 'manual',
      })
      
      router.push('/admin/login')
    } catch (error) {
      console.error('退出登录失败:', error)
      
      // 记录退出登录失败埋点
      analytics?.track('user_logout_error', {
        userId: user?.id,
        errorMessage: error instanceof Error ? error.message : String(error),
      })
      
      // 即使退出失败也跳转到登录页
      router.push('/admin/login')
    } finally {
      setIsLoggingOut(false)
      setShowLogoutConfirm(false)
    }
  }

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false)
    
    // 记录取消退出登录埋点
    analytics?.track('logout_cancelled', {
      userId: user?.id,
    })
  }

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    if (href === '/admin/config') {
      return pathname === '/admin/config'
    }
    
    // 处理带查询参数的配置页面
    if (href.includes('?category=')) {
      const [basePath, query] = href.split('?')
      if (pathname === basePath) {
        const targetCategory = new URLSearchParams(query).get('category')
        const currentCategory = searchParams.get('category')
        return currentCategory === targetCategory
      }
      return false
    }
    
    return pathname.startsWith(href)
  }

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* 头部 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🎌</span>
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">{APP_CONFIG.name}</h1>
                <p className="text-xs text-gray-500">管理后台</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0"
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* 用户信息 */}
      {user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3 hover:bg-gray-50 rounded-md p-2 transition-all duration-200 cursor-pointer">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-purple-100 text-purple-600">
                {user.nickname?.[0] || user.username?.[0] || user.email[0]}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.nickname || user.username || user.email}
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  <Badge 
                    variant={user.role === 'SUPER_ADMIN' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {user.role === 'SUPER_ADMIN' ? '超级管理员' : '管理员'}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 导航菜单 */}
      <nav className="flex-1 overflow-y-auto">
        <div className="p-2">
          {menuItems.map((item) => (
            <div key={item.title} className="mb-2">
              {item.items ? (
                // 分组菜单
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => toggleGroup(item.title)}
                    className={cn(
                      "w-full justify-start text-left font-normal transition-all duration-200",
                      "hover:bg-purple-50 hover:text-purple-700 hover:border-r-2 hover:border-purple-300",
                      collapsed && "justify-center"
                    )}
                  >
                    {React.createElement(item.icon, { className: "h-4 w-4" })}
                    {!collapsed && (
                      <>
                        <span className="ml-2">{item.title}</span>
                        <div className={cn(
                          "ml-auto transition-transform",
                          expandedGroups.includes(item.title) && "rotate-90"
                        )}>
                          ▶
                        </div>
                      </>
                    )}
                  </Button>
                  
                  {!collapsed && expandedGroups.includes(item.title) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.items.map((subItem) => (
                        <Link key={subItem.href} href={subItem.href!}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start text-left font-normal transition-all duration-200",
                              "hover:bg-purple-50 hover:text-purple-600 hover:border-r-2 hover:border-purple-300",
                              isActive(subItem.href!) && "bg-purple-100 text-purple-700 border-r-2 border-purple-600 shadow-sm"
                            )}
                          >
                            {React.createElement(subItem.icon, { className: "h-3 w-3" })}
                            <span className="ml-2">{subItem.title}</span>
                            {subItem.badge && (
                              <Badge variant="secondary" className="ml-auto text-xs">
                                {subItem.badge}
                              </Badge>
                            )}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // 单个菜单项
                <Link href={item.href!}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left font-normal transition-all duration-200",
                      "hover:bg-purple-50 hover:text-purple-600 hover:border-r-2 hover:border-purple-300",
                      collapsed && "justify-center",
                      isActive(item.href!) && "bg-purple-100 text-purple-700 border-r-2 border-purple-600 shadow-sm"
                    )}
                  >
                    {React.createElement(item.icon, { className: "h-4 w-4" })}
                    {!collapsed && <span className="ml-2">{item.title}</span>}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* 底部操作 */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          className={cn(
            "w-full justify-start text-red-600 transition-all duration-200",
            "hover:text-red-700 hover:bg-red-50 hover:border-r-2 hover:border-red-300",
            collapsed && "justify-center",
            isLoggingOut && "opacity-50 cursor-not-allowed"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">{isLoggingOut ? '退出中...' : '退出登录'}</span>}
        </Button>
      </div>

      {/* 退出登录确认对话框 */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999]" onClick={handleLogoutCancel}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <LogOut className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">确认退出登录</h3>
                <p className="text-sm text-gray-500">您确定要退出管理后台吗？</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">当前用户：</span>
                <span className="font-medium text-gray-900">{user?.email || user?.username}</span>
                <Badge variant="secondary" className="ml-auto">{user?.role}</Badge>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleLogoutCancel}
                disabled={isLoggingOut}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                onClick={handleLogoutConfirm}
                disabled={isLoggingOut}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isLoggingOut ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    退出中...
                  </span>
                ) : (
                  '确认退出'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
