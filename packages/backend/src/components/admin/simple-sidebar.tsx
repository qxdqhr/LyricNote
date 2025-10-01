'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SimpleSidebarProps {
  user?: {
    username: string
    nickname?: string
    email: string
    role: string
  }
}

const menuItems = [
  {
    title: '仪表板',
    href: '/admin/dashboard',
    description: '系统概览和统计'
  },
  {
    title: '用户管理',
    href: '/admin/users',
    description: '管理用户账户'
  },
  {
    title: '系统配置',
    href: '/admin/config',
    description: '动态配置管理'
  }
]

export function SimpleSidebar({ user }: SimpleSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🎌</span>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">LyricNote</h1>
            <p className="text-xs text-gray-500">管理后台</p>
          </div>
        </div>
      </div>

      {/* 用户信息 */}
      {user && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-medium text-sm">
                {user.nickname?.[0] || user.username?.[0] || user.email[0]}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user.nickname || user.username}
              </p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* 导航菜单 */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  isActive(item.href) && "bg-purple-50 text-purple-700 border-r-2 border-purple-600"
                )}
              >
                <span className="mr-2">📄</span>
                <span>{item.title}</span>
              </Button>
            </Link>
          ))}
        </div>
      </nav>

      {/* 底部操作 */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <span className="mr-2">🚪</span>
          <span>退出登录</span>
        </Button>
      </div>
    </div>
  )
}

