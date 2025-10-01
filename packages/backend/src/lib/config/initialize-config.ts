import { getConfigService } from './config-service'
import { DrizzleAuthService } from '../auth/drizzle-auth'

/**
 * 初始化系统配置
 * 在应用启动时调用，确保所有必要的配置项都存在
 */
export async function initializeSystemConfig(): Promise<void> {
  console.log('🔧 开始初始化系统配置...')
  
  try {
    const configService = getConfigService()
    
    // 初始化默认配置
    await configService.initializeDefaultConfigs()
    
    // 检查必需的配置项
    await checkRequiredConfigs()
    
    console.log('✅ 系统配置初始化完成')
  } catch (error) {
    console.error('❌ 系统配置初始化失败:', error)
    throw error
  }
}

/**
 * 检查必需的配置项
 */
async function checkRequiredConfigs(): Promise<void> {
  const configService = getConfigService()
  
  const requiredConfigs = [
    'domain',
    'app_name',
    'app_version'
  ]
  
  for (const key of requiredConfigs) {
    const value = await configService.getConfig(key)
    if (!value) {
      console.warn(`⚠️ 必需配置项 ${key} 未设置`)
    }
  }
}

/**
 * 创建管理员账户（如果不存在）
 */
export async function createDefaultAdmin(): Promise<void> {
  console.log('👤 检查默认管理员账户...')
  
  try {
    // 使用 DrizzleAuthService 创建管理员
    try {
      const admin = await DrizzleAuthService.signUp(
        'admin@lyricnote.local',
        'admin123',
        'admin',
        'SUPER_ADMIN'
      )
      
      console.log('✅ 默认管理员账户已创建')
      console.log('📧 邮箱: admin@lyricnote.local')
      console.log('🔒 密码: admin123')
      console.log('⚠️  请及时修改默认密码！')
      
    } catch (error :any) {
      if (error.message.includes('用户已存在')) {
        console.log('✅ 管理员账户已存在')
        return
      }
      throw error
    }
    
  } catch (error) {
    console.error('❌ 创建管理员账户失败:', error)
  }
}

/**
 * 系统启动时的完整初始化
 */
export async function initializeSystem(): Promise<void> {
  console.log('🚀 LyricNote 系统初始化开始...')
  
  try {
    // 初始化配置
    await initializeSystemConfig()
    
    // 创建默认管理员
    await createDefaultAdmin()
    
    console.log('🎉 LyricNote 系统初始化完成！')
    console.log('🌐 访问管理后台: https://qhr062.top/admin')
    
  } catch (error) {
    console.error('💥 系统初始化失败:', error)
    throw error
  }
}

export default initializeSystemConfig
