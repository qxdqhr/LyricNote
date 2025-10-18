'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Database,
  Cloud,
  Bot,
  Shield,
  Smartphone,
  Settings,
  Save,
  RefreshCw,
  Check,
  AlertTriangle,
  Eye,
  EyeOff,
  BarChart3
} from 'lucide-react'
import { AnalyticsDashboard } from '@lyricnote/shared/analytics/components'

interface ConfigItem {
  key: string
  value: any
  type: string
  isRequired: boolean
  isSensitive: boolean
  description?: string
  defaultValue?: any
  readonly?: boolean
}

interface ConfigCategory {
  [key: string]: ConfigItem
}

interface AllConfigs {
  [category: string]: ConfigCategory
}

const CONFIG_CATEGORIES = {
  database: { 
    name: '数据库配置', 
    icon: Database, 
    description: 'PostgreSQL和Redis数据库连接配置',
    color: 'text-blue-600 bg-blue-100'
  },
  storage: { 
    name: '存储配置', 
    icon: Cloud, 
    description: '阿里云OSS对象存储配置',
    color: 'text-green-600 bg-green-100'
  },
  ai_service: { 
    name: 'AI服务配置', 
    icon: Bot, 
    description: 'DeepSeek AI服务配置',
    color: 'text-purple-600 bg-purple-100'
  },
  security: { 
    name: '安全配置', 
    icon: Shield, 
    description: 'JWT、会话等安全相关配置',
    color: 'text-red-600 bg-red-100'
  },
  mobile: { 
    name: '移动端配置', 
    icon: Smartphone, 
    description: 'Expo移动端构建配置',
    color: 'text-orange-600 bg-orange-100'
  },
  analytics: { 
    name: '埋点数据分析', 
    icon: BarChart3, 
    description: '查看和分析用户行为数据',
    color: 'text-indigo-600 bg-indigo-100'
  },
  developer: { 
    name: '开发者调试', 
    icon: Settings, 
    description: '日志和埋点输出控制',
    color: 'text-gray-600 bg-gray-100'
  }
} as const

type ConfigCategoryKey = keyof typeof CONFIG_CATEGORIES

// 开发者调试配置组件
function DeveloperDebugConfig() {
  const [loggerDebug, setLoggerDebug] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('logger-debug') === 'true'
    }
    return false
  })
  
  const [analyticsDebug, setAnalyticsDebug] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('analytics-debug') === 'true'
    }
    return false
  })
  
  const [saved, setSaved] = useState(false)

  const handleLoggerDebugChange = (enabled: boolean) => {
    setLoggerDebug(enabled)
    if (typeof window !== 'undefined') {
      localStorage.setItem('logger-debug', enabled.toString())
      // 触发自定义事件，通知其他组件配置已更改
      window.dispatchEvent(new CustomEvent('logger-debug-changed', { detail: { enabled } }))
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleAnalyticsDebugChange = (enabled: boolean) => {
    setAnalyticsDebug(enabled)
    if (typeof window !== 'undefined') {
      localStorage.setItem('analytics-debug', enabled.toString())
      // 触发自定义事件，通知其他组件配置已更改
      window.dispatchEvent(new CustomEvent('analytics-debug-changed', { detail: { enabled } }))
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const clearAllLogs = () => {
    if (typeof window !== 'undefined') {
      console.clear()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>开发者调试配置</CardTitle>
                <CardDescription>
                  控制日志库和埋点库在浏览器控制台的输出
                </CardDescription>
              </div>
            </div>
            {saved && (
              <Badge variant="default" className="bg-green-600">
                <Check className="h-3 w-3 mr-1" />
                已保存
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 日志调试开关 */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">日志调试模式</span>
                <Badge variant={loggerDebug ? "default" : "secondary"} className="text-xs">
                  {loggerDebug ? "已启用" : "已关闭"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                启用后，日志库会将所有日志输出到浏览器控制台（包括 info、warn、error 等级别）
              </p>
            </div>
            <button
              onClick={() => handleLoggerDebugChange(!loggerDebug)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ml-4 ${
                loggerDebug ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  loggerDebug ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 埋点调试开关 */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">埋点调试模式</span>
                <Badge variant={analyticsDebug ? "default" : "secondary"} className="text-xs">
                  {analyticsDebug ? "已启用" : "已关闭"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                启用后，埋点库会将所有事件信息输出到浏览器控制台（包括事件追踪、上传等）
              </p>
            </div>
            <button
              onClick={() => handleAnalyticsDebugChange(!analyticsDebug)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ml-4 ${
                analyticsDebug ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  analyticsDebug ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 清除控制台按钮 */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-amber-200 bg-amber-50">
            <div className="flex-1">
              <span className="font-medium text-gray-900 block mb-1">清除控制台日志</span>
              <p className="text-sm text-gray-600">
                清空浏览器控制台中的所有日志输出
              </p>
            </div>
            <Button
              variant="outline"
              onClick={clearAllLogs}
              className="ml-4 border-amber-300 hover:bg-amber-100"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              清除
            </Button>
          </div>

          {/* 提示信息 */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>注意：</strong>这些设置保存在浏览器本地存储中，仅影响当前浏览器。
              在生产环境中，建议关闭调试模式以提高性能。
            </AlertDescription>
          </Alert>

          {/* 当前状态总结 */}
          <Card className="bg-gray-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">当前调试状态</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">日志调试：</span>
                  <Badge variant={loggerDebug ? "default" : "secondary"}>
                    {loggerDebug ? "开启" : "关闭"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">埋点调试：</span>
                  <Badge variant={analyticsDebug ? "default" : "secondary"}>
                    {analyticsDebug ? "开启" : "关闭"}
                  </Badge>
                </div>
                <Separator className="my-2" />
                <div className="text-xs text-gray-500">
                  按 F12 或 Cmd+Option+I (Mac) 打开开发者工具查看控制台输出
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

function ConfigManagementContent() {
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category') || 'database'
  
  const [configs, setConfigs] = useState<AllConfigs>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [validating, setValidating] = useState(false)
  const [editedConfigs, setEditedConfigs] = useState<Record<string, any>>({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [validationResults, setValidationResults] = useState<Record<string, any>>({})
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({})
  const [showAllSensitive, setShowAllSensitive] = useState(false)

  // 获取认证token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token')
    }
    return null
  }

  // 加载配置
  const loadConfigs = async () => {
    try {
      setLoading(true)
      const token = getAuthToken()
      
      const response = await fetch('/api/admin/config', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        setConfigs(data.data)
        setError('')
      } else {
        setError(data.error || '加载配置失败')
      }
    } catch (error) {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 保存配置
  const saveConfigs = async (category: string) => {
    const categoryConfigs = editedConfigs[category]
    if (!categoryConfigs || Object.keys(categoryConfigs).length === 0) {
      setError('没有需要保存的配置')
      return
    }

    // 过滤掉只读配置项
    const filteredConfigs = Object.fromEntries(
      Object.entries(categoryConfigs).filter(([key]) => {
        const config = configs[category]?.[key]
        return config && !config.readonly
      })
    )

    if (Object.keys(filteredConfigs).length === 0) {
      setError('没有可保存的配置（只读配置不能修改）')
      return
    }

    try {
      setSaving(true)
      const token = getAuthToken()
      
      const response = await fetch(`/api/admin/config/${category}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ configs: filteredConfigs })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message)
        setError('')
        // 清除编辑状态
        setEditedConfigs(prev => ({ ...prev, [category]: {} }))
        // 重新加载配置
        await loadConfigs()
      } else {
        setError(data.error || '保存失败')
      }
    } catch (error) {
      setError('网络错误，请重试')
    } finally {
      setSaving(false)
    }
  }

  // 验证配置
  const validateConfigs = async (category: string) => {
    const categoryConfigs = editedConfigs[category] || {}
    const currentConfigs = configs[category] || {}
    
    // 合并当前配置和编辑的配置
    const configsToValidate = { ...currentConfigs }
    Object.keys(configsToValidate).forEach(key => {
      if (categoryConfigs[key] !== undefined) {
        configsToValidate[key] = categoryConfigs[key]
      } else {
        configsToValidate[key] = currentConfigs[key]?.value
      }
    })

    try {
      setValidating(true)
      const token = getAuthToken()
      
      const response = await fetch('/api/admin/config/validate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category, configs: configsToValidate })
      })

      const data = await response.json()

      if (data.success) {
        setValidationResults(prev => ({ ...prev, [category]: data.data }))
        setError('')
      } else {
        setError(data.error || '验证失败')
      }
    } catch (error) {
      setError('网络错误，请重试')
    } finally {
      setValidating(false)
    }
  }

  // 更新配置值
  const updateConfigValue = (category: string, key: string, value: any) => {
    setEditedConfigs(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  // 获取配置值（优先使用编辑的值）
  const getConfigValue = (category: string, key: string) => {
    if (editedConfigs[category] && editedConfigs[category][key] !== undefined) {
      return editedConfigs[category][key]
    }
    return configs[category]?.[key]?.value || ''
  }

  // 检查是否有未保存的更改
  const hasUnsavedChanges = (category: string) => {
    return editedConfigs[category] && Object.keys(editedConfigs[category]).length > 0
  }

  // 切换敏感信息显示
  const toggleSensitiveVisibility = (key: string) => {
    setShowSensitive(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // 切换所有敏感信息显示
  const toggleAllSensitiveVisibility = () => {
    setShowAllSensitive(prev => {
      const newState = !prev
      // 如果设置为显示所有，则更新所有敏感字段的状态
      if (configs[activeCategory]) {
        const sensitiveKeys = Object.entries(configs[activeCategory])
          .filter(([, config]) => config.isSensitive)
          .map(([key]) => key)
        
        setShowSensitive(prevSensitive => {
          const newSensitive = { ...prevSensitive }
          sensitiveKeys.forEach(key => {
            newSensitive[key] = newState
          })
          return newSensitive
        })
      }
      return newState
    })
  }

  useEffect(() => {
    loadConfigs()
  }, [])

  // 清除消息
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('')
        setError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* 消息提示 */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* 配置详情 */}
        {!CONFIG_CATEGORIES[activeCategory as ConfigCategoryKey] ? (
          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">未知的配置分类</h3>
              <p className="text-gray-600">
                请从左侧导航栏选择一个有效的配置分类。
              </p>
            </CardContent>
          </Card>
        ) : activeCategory === 'analytics' ? (
          // 埋点数据分析特殊处理
          <div className="space-y-6">
            <AnalyticsDashboard apiBaseUrl="/api/analytics" />
          </div>
        ) : activeCategory === 'developer' ? (
          // 开发者调试配置特殊处理
          <DeveloperDebugConfig />
        ) : !configs[activeCategory] ? (
          <Card>
            <CardContent className="p-6 text-center">
              <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">正在加载配置数据...</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${CONFIG_CATEGORIES[activeCategory as ConfigCategoryKey].color}`}>
                    {React.createElement(CONFIG_CATEGORIES[activeCategory as ConfigCategoryKey].icon, { className: "h-5 w-5" })}
                  </div>
                  <div>
                    <CardTitle>{CONFIG_CATEGORIES[activeCategory as ConfigCategoryKey].name}</CardTitle>
                    <CardDescription>
                      {CONFIG_CATEGORIES[activeCategory as ConfigCategoryKey].description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {/* 全局敏感信息开关 */}
                  {Object.values(configs[activeCategory]).some(config => config.isSensitive) && (
                    <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
                      <Shield className="h-3 w-3 text-amber-600" />
                      <span className="text-xs text-amber-700">敏感信息:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleAllSensitiveVisibility}
                        className="h-6 px-2 text-xs hover:bg-amber-100"
                      >
                        {showAllSensitive ? (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            隐藏
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            显示
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => validateConfigs(activeCategory)}
                    disabled={validating}
                  >
                    {validating ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    验证配置
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => saveConfigs(activeCategory)}
                    disabled={saving || !hasUnsavedChanges(activeCategory)}
                  >
                    {saving ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    保存配置
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(configs[activeCategory]).map(([key, config]) => (
                <div key={key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">
                        {config.description || key}
                        {config.isRequired && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">键名: {key}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {config.readonly && (
                        <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                          📖 只读
                        </Badge>
                      )}
                      {config.isSensitive && (
                        <>
                          <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                            🔒 敏感信息
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSensitiveVisibility(key)}
                            className="h-8 w-8 p-0 hover:bg-gray-100 relative group"
                            title={(showSensitive[key] || showAllSensitive) ? "隐藏敏感信息" : "显示敏感信息"}
                          >
                            {(showSensitive[key] || showAllSensitive) ? (
                              <EyeOff className="h-4 w-4 text-gray-600" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-600" />
                            )}
                            {/* 悬停提示 */}
                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                              <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                {(showSensitive[key] || showAllSensitive) ? "隐藏" : "显示"}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {config.readonly ? (
                      // 只读显示
                      <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700 font-mono">
                        {getConfigValue(activeCategory, key)?.toString() || '未设置'}
                      </div>
                    ) : config.type === 'boolean' ? (
                      <select
                        value={getConfigValue(activeCategory, key) ? 'true' : 'false'}
                        onChange={(e) => updateConfigValue(activeCategory, key, e.target.value === 'true')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="true">是</option>
                        <option value="false">否</option>
                      </select>
                    ) : (
                      <div className="relative">
                        {config.isSensitive && !(showSensitive[key] || showAllSensitive) ? (
                          // 敏感信息掩码显示
                          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center justify-between min-h-[40px]">
                            <span className="text-gray-600 font-mono tracking-wider">
                              {'*'.repeat(Math.min(getConfigValue(activeCategory, key)?.toString().length || 16, 24))}
                            </span>
                            <Badge variant="secondary" className="text-xs ml-2">
                              已隐藏
                            </Badge>
                          </div>
                        ) : (
                          // 正常输入框
                          <input
                            type={config.type === 'number' ? 'number' : 'text'}
                            value={getConfigValue(activeCategory, key)}
                            onChange={(e) => updateConfigValue(activeCategory, key, 
                              config.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value
                            )}
                            placeholder={config.defaultValue ? `默认值: ${config.defaultValue}` : ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        )}
                      </div>
                    )}

                    {/* 显示验证结果 */}
                    {validationResults[activeCategory]?.validationResults?.[key] && (
                      <div className="flex items-center space-x-2 text-sm">
                        {validationResults[activeCategory].validationResults[key].valid ? (
                          <>
                            <Check className="h-4 w-4 text-green-600" />
                            <span className="text-green-600">验证通过</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="text-red-600">
                              {validationResults[activeCategory].validationResults[key].error}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                </div>
              ))}

              {/* 连接测试结果 */}
              {validationResults[activeCategory]?.connectionTest && (
                <Card className="mt-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">连接测试结果</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {validationResults[activeCategory].connectionTest.success ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <Check className="h-4 w-4" />
                        <span>连接测试成功</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span>
                          连接测试失败: {validationResults[activeCategory].connectionTest.error}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}

export default function ConfigManagement() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfigManagementContent />
    </Suspense>
  )
}
