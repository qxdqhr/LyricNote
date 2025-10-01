'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Database,
  Shield,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Info
} from 'lucide-react'

interface DatabaseConnectionInfo {
  host: string
  port: number
  database: string
  username: string
  password: string
  ssl: boolean
  poolSize?: number
  queryTimeout?: number
  connectionString: string
  source: string
}

export function DatabaseConnectionDisplay() {
  const [connectionInfo, setConnectionInfo] = useState<DatabaseConnectionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'success' | 'error'>('unknown')
  const [error, setError] = useState('')

  // 获取数据库连接信息
  const loadConnectionInfo = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('auth-token')
      
      const response = await fetch('/api/admin/database-connection', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        setConnectionInfo(data.data)
        setError('')
      } else {
        setError(data.error || '获取连接信息失败')
      }
    } catch (error) {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 测试数据库连接
  const testConnection = async () => {
    try {
      setTestingConnection(true)
      const token = localStorage.getItem('auth-token')
      
      const response = await fetch('/api/admin/database-connection/test', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        setConnectionStatus('success')
        setError('')
      } else {
        setConnectionStatus('error')
        setError(data.error || '连接测试失败')
      }
    } catch (error) {
      setConnectionStatus('error')
      setError('网络错误，请重试')
    } finally {
      setTestingConnection(false)
    }
  }

  useEffect(() => {
    loadConnectionInfo()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">正在加载数据库连接信息...</p>
        </CardContent>
      </Card>
    )
  }

  if (error && !connectionInfo) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <Button 
            variant="outline" 
            onClick={loadConnectionInfo}
            className="mt-4"
          >
            重新加载
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 连接状态警告 */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>重要说明：</strong> 数据库连接配置通过环境变量管理，不能在此界面修改。
          如需修改，请编辑 <code>.env.local</code> 文件或设置环境变量 <code>DATABASE_URL</code>。
        </AlertDescription>
      </Alert>

      {connectionInfo && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>数据库连接信息</CardTitle>
                  <CardDescription>
                    当前使用的数据库连接配置（只读）
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={testConnection}
                  disabled={testingConnection}
                >
                  {testingConnection ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Database className="h-4 w-4 mr-2" />
                  )}
                  测试连接
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* 连接状态 */}
            {connectionStatus !== 'unknown' && (
              <div className="p-3 rounded-lg border">
                {connectionStatus === 'success' ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">连接正常</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">连接失败</span>
                    {error && <span className="text-sm">- {error}</span>}
                  </div>
                )}
              </div>
            )}

            {/* 连接参数 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">数据库主机</label>
                <div className="p-2 bg-gray-50 rounded border text-sm font-mono">
                  {connectionInfo.host}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">端口</label>
                <div className="p-2 bg-gray-50 rounded border text-sm font-mono">
                  {connectionInfo.port}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">数据库名</label>
                <div className="p-2 bg-gray-50 rounded border text-sm font-mono">
                  {connectionInfo.database}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">用户名</label>
                <div className="p-2 bg-gray-50 rounded border text-sm font-mono">
                  {connectionInfo.username}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">密码</label>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                      <Shield className="h-3 w-3 mr-1" />
                      敏感信息
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="h-6 w-6 p-0"
                    >
                      {showPassword ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="p-2 bg-gray-50 rounded border text-sm font-mono">
                  {showPassword ? connectionInfo.password : '•'.repeat(connectionInfo.password.length)}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">SSL</label>
                <div className="p-2 bg-gray-50 rounded border text-sm">
                  <Badge variant={connectionInfo.ssl ? "default" : "secondary"}>
                    {connectionInfo.ssl ? "启用" : "禁用"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* 高级设置 */}
            {(connectionInfo.poolSize || connectionInfo.queryTimeout) && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">高级设置</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {connectionInfo.poolSize && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">连接池大小</label>
                      <div className="p-2 bg-gray-50 rounded border text-sm font-mono">
                        {connectionInfo.poolSize}
                      </div>
                    </div>
                  )}

                  {connectionInfo.queryTimeout && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">查询超时（毫秒）</label>
                      <div className="p-2 bg-gray-50 rounded border text-sm font-mono">
                        {connectionInfo.queryTimeout}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 连接字符串 */}
            <div className="border-t pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">连接字符串</label>
                <div className="p-2 bg-gray-50 rounded border text-sm font-mono break-all">
                  {connectionInfo.connectionString}
                </div>
              </div>

              <div className="space-y-2 mt-3">
                <label className="text-sm font-medium text-gray-700">配置来源</label>
                <div className="p-2 bg-gray-50 rounded border text-sm">
                  <Badge variant="outline">
                    {connectionInfo.source}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
