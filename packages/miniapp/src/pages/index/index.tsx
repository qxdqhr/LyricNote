import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { apiService } from '../../services/api'
import { APP_TITLES, APP_CONFIG } from '@lyricnote/shared'
import { logger } from '../../lib/logger'
import './index.scss'

interface User {
  id: string
  email: string
  username: string
  nickname?: string
  role: string
}

export default function Index() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useLoad(() => {
    logger.debug('Index page loaded')
    checkAuthStatus()
  })

  const checkAuthStatus = async () => {
    try {
      setLoading(true)
      const isAuth = await apiService.isAuthenticated()
      
      if (isAuth) {
        const response = await apiService.getCurrentUser()
        if (response.success && response.data) {
          setUser(response.data)
        }
      }
    } catch (error) {
      logger.error('检查登录状态失败', error instanceof Error ? error : new Error(String(error)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='index'>
      {/* Header */}
      <View className='header'>
        <Text className='header-title'>{APP_TITLES.main}</Text>
      </View>

      {/* Main Content */}
      <View className='content'>
        <Text className='emoji'>🎵</Text>
        <Text className='title'>{APP_TITLES.welcome}</Text>
        <Text className='subtitle'>{APP_CONFIG.description}</Text>
        
        {!loading && user && (
          <View className='user-welcome'>
            <Text className='welcome-message'>你好，{user.username}！</Text>
          </View>
        )}
        
        {!loading && !user && (
          <View className='auth-hint'>
            <Text className='hint-text'>请前往"我的"页面登录</Text>
          </View>
        )}
      </View>
    </View>
  )
}


