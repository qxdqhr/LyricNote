import crypto from 'crypto'
import { db } from '../drizzle/db'
import { systemConfigs } from '../../../drizzle/migrations/schema'
import { eq } from 'drizzle-orm'
import { NEW_CONFIG_TEMPLATES } from './config-templates-new'
import { configLogger } from '../logger'

// 导出新的配置模板作为默认配置模板  
export const CONFIG_TEMPLATES = NEW_CONFIG_TEMPLATES

// 配置分类枚举
export enum ConfigCategory {
  DATABASE = 'database',
  STORAGE = 'storage', 
  AI_SERVICE = 'ai_service',
  EMAIL = 'email',
  SECURITY = 'security',
  SYSTEM = 'system',
  MOBILE = 'mobile'
}

// 配置类型枚举
export enum ConfigType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  JSON = 'json'
}

// 配置项接口
export interface ConfigItem {
  key: string
  value: any
  category: ConfigCategory
  type: ConfigType
  isRequired: boolean
  isSensitive: boolean
  description?: string
  defaultValue?: any
}

// 配置模板定义（已废弃，数据库连接配置已移至环境变量）
export const LEGACY_CONFIG_TEMPLATES: Record<string, ConfigItem[]> = {
  [ConfigCategory.DATABASE]: [
    {
      key: 'postgres_host',
      value: 'localhost',
      category: ConfigCategory.DATABASE,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: false,
      description: 'PostgreSQL服务器地址',
      defaultValue: 'localhost'
    },
    {
      key: 'postgres_port', 
      value: 5432,
      category: ConfigCategory.DATABASE,
      type: ConfigType.NUMBER,
      isRequired: true,
      isSensitive: false,
      description: 'PostgreSQL端口号',
      defaultValue: 5432
    },
    {
      key: 'postgres_database',
      value: 'lyricnote',
      category: ConfigCategory.DATABASE,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: false,
      description: 'PostgreSQL数据库名',
      defaultValue: 'lyricnote'
    },
    {
      key: 'postgres_username',
      value: 'lyricnote',
      category: ConfigCategory.DATABASE,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: false,
      description: 'PostgreSQL用户名',
      defaultValue: 'lyricnote'
    },
    {
      key: 'postgres_password',
      value: '',
      category: ConfigCategory.DATABASE,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: true,
      description: 'PostgreSQL密码'
    },
    {
      key: 'redis_host',
      value: 'localhost',
      category: ConfigCategory.DATABASE,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: false,
      description: 'Redis服务器地址',
      defaultValue: 'localhost'
    },
    {
      key: 'redis_port',
      value: 6379,
      category: ConfigCategory.DATABASE,
      type: ConfigType.NUMBER,
      isRequired: true,
      isSensitive: false,
      description: 'Redis端口号',
      defaultValue: 6379
    },
    {
      key: 'redis_password',
      value: '',
      category: ConfigCategory.DATABASE,
      type: ConfigType.STRING,
      isRequired: false,
      isSensitive: true,
      description: 'Redis密码'
    }
  ],
  
  [ConfigCategory.STORAGE]: [
    {
      key: 'aliyun_oss_access_key_id',
      value: '',
      category: ConfigCategory.STORAGE,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: true,
      description: '阿里云OSS访问密钥ID'
    },
    {
      key: 'aliyun_oss_access_key_secret',
      value: '',
      category: ConfigCategory.STORAGE,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: true,
      description: '阿里云OSS访问密钥Secret'
    },
    {
      key: 'aliyun_oss_bucket',
      value: 'lyricnote-prod',
      category: ConfigCategory.STORAGE,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: false,
      description: '阿里云OSS存储桶名称',
      defaultValue: 'lyricnote-prod'
    },
    {
      key: 'aliyun_oss_region',
      value: 'oss-cn-hangzhou',
      category: ConfigCategory.STORAGE,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: false,
      description: '阿里云OSS区域',
      defaultValue: 'oss-cn-hangzhou'
    }
  ],
  
  [ConfigCategory.AI_SERVICE]: [
    {
      key: 'deepseek_api_key',
      value: '',
      category: ConfigCategory.AI_SERVICE,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: true,
      description: 'DeepSeek API密钥'
    },
    {
      key: 'deepseek_api_url',
      value: 'https://api.deepseek.com',
      category: ConfigCategory.AI_SERVICE,
      type: ConfigType.STRING,
      isRequired: false,
      isSensitive: false,
      description: 'DeepSeek API地址',
      defaultValue: 'https://api.deepseek.com'
    },
    {
      key: 'deepseek_model',
      value: 'deepseek-chat',
      category: ConfigCategory.AI_SERVICE,
      type: ConfigType.STRING,
      isRequired: false,
      isSensitive: false,
      description: 'DeepSeek模型名称',
      defaultValue: 'deepseek-chat'
    }
  ],
  
  [ConfigCategory.SECURITY]: [
    {
      key: 'jwt_secret',
      value: '',
      category: ConfigCategory.SECURITY,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: true,
      description: 'JWT密钥'
    },
    {
      key: 'nextauth_secret',
      value: '',
      category: ConfigCategory.SECURITY,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: true,
      description: 'NextAuth密钥'
    },
    {
      key: 'session_timeout',
      value: 86400,
      category: ConfigCategory.SECURITY,
      type: ConfigType.NUMBER,
      isRequired: false,
      isSensitive: false,
      description: '会话超时时间(秒)',
      defaultValue: 86400
    },
    {
      key: 'rate_limit_requests',
      value: 100,
      category: ConfigCategory.SECURITY,
      type: ConfigType.NUMBER,
      isRequired: false,
      isSensitive: false,
      description: '每分钟最大请求数',
      defaultValue: 100
    }
  ],
  
  [ConfigCategory.MOBILE]: [
    {
      key: 'expo_token',
      value: '',
      category: ConfigCategory.MOBILE,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: true,
      description: 'Expo访问令牌'
    },
    {
      key: 'expo_username',
      value: '',
      category: ConfigCategory.MOBILE,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: false,
      description: 'Expo用户名'
    },
    {
      key: 'expo_project_id',
      value: '',
      category: ConfigCategory.MOBILE,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: false,
      description: 'Expo项目ID'
    }
  ],
  
  [ConfigCategory.SYSTEM]: [
    {
      key: 'domain',
      value: 'qhr062.top',
      category: ConfigCategory.SYSTEM,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: false,
      description: '系统域名',
      defaultValue: 'qhr062.top'
    },
    {
      key: 'app_name',
      value: 'LyricNote',
      category: ConfigCategory.SYSTEM,
      type: ConfigType.STRING,
      isRequired: false,
      isSensitive: false,
      description: '应用名称',
      defaultValue: 'LyricNote'
    },
    {
      key: 'app_version',
      value: '1.0.0',
      category: ConfigCategory.SYSTEM,
      type: ConfigType.STRING,
      isRequired: false,
      isSensitive: false,
      description: '应用版本',
      defaultValue: '1.0.0'
    }
  ]
}

// 配置管理服务类
export class ConfigService {
  private configCache: Map<string, any> = new Map()
  private encryptionKey: string
  
  constructor() {
    // 使用环境变量或默认密钥作为加密密钥
    this.encryptionKey = process.env.CONFIG_ENCRYPTION_KEY || 'lyricnote-config-key-2024'
    this.loadConfigsFromDatabase()
  }

  // 从数据库加载配置到缓存
  private async loadConfigsFromDatabase(): Promise<void> {
    try {
      const configs = await db.select().from(systemConfigs)
      
      configs.forEach(config => {
        let value = config.value
        
        // 如果是敏感配置，解密
        if (this.isSensitiveConfig(config.key)) {
          try {
            value = this.decrypt(config.value as string)
          } catch (error) {
            configLogger.warn(`Failed to decrypt config ${config.key}`, error)
          }
        }
        
        this.configCache.set(config.key, value)
      })
      
      configLogger.info(`已加载 ${configs.length} 个配置项`)
    } catch (error) {
      configLogger.error('加载配置失败', error instanceof Error ? error : new Error(String(error)))
    }
  }

  // 获取配置值
  public async getConfig(key: string, defaultValue?: any): Promise<any> {
    if (!key) {
      return defaultValue
    }
    
    // 优先从环境变量获取
    const envValue = process.env[key.toUpperCase()]
    if (envValue !== undefined) {
      return this.parseValue(envValue, this.getConfigType(key))
    }
    
    // 从缓存获取
    if (this.configCache.has(key)) {
      return this.configCache.get(key)
    }
    
    // 从数据库获取
    try {
      const [config] = await db.select().from(systemConfigs).where(eq(systemConfigs.key, key)).limit(1)
      
      if (config) {
        let value = config.value
        
        if (this.isSensitiveConfig(key)) {
          value = this.decrypt(config.value as string)
        }
        
        this.configCache.set(key, value)
        return value
      }
    } catch (error) {
      configLogger.error(`获取配置 ${key} 失败`, error instanceof Error ? error : new Error(String(error)))
    }
    
    return defaultValue
  }

  // 设置配置值
  public async setConfig(key: string, value: any, description?: string): Promise<void> {
    try {
      const category = this.getConfigCategory(key)
      const type = this.getConfigType(key)
      const isSensitive = this.isSensitiveConfig(key)
      
      // 验证配置值
      const validatedValue = this.validateValue(value, type)
      
      // 敏感配置需要加密
      const storageValue = isSensitive ? this.encrypt(validatedValue) : validatedValue
      
      // 保存到数据库
      const existing = await db.select().from(systemConfigs).where(eq(systemConfigs.key, key)).limit(1)
      
      if (existing.length > 0) {
        await db.update(systemConfigs)
          .set({
            value: storageValue,
            description: description || this.getConfigDescription(key),
            updatedAt: new Date().toISOString()
          })
          .where(eq(systemConfigs.key, key))
      } else {
        await db.insert(systemConfigs).values({
          id: crypto.randomBytes(16).toString('hex'),
          key,
          value: storageValue,
          description: description || this.getConfigDescription(key),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
      
      // 更新缓存
      this.configCache.set(key, validatedValue)
      
      configLogger.info(`配置 ${key} 已更新`)
    } catch (error) {
      configLogger.error(`设置配置 ${key} 失败`, error instanceof Error ? error : new Error(String(error)))
      throw error
    }
  }

  // 获取分类下的所有配置
  public async getConfigsByCategory(category: ConfigCategory): Promise<Record<string, any>> {
    const configs: Record<string, any> = {}
    const template = CONFIG_TEMPLATES[category] || []
    
    for (const item of template) {
      configs[item.key] = await this.getConfig(item.key, item.defaultValue)
    }
    
    return configs
  }

  // 批量设置配置
  public async setConfigs(configs: Record<string, any>): Promise<void> {
    for (const [key, value] of Object.entries(configs)) {
      await this.setConfig(key, value)
    }
  }

  // 删除配置
  public async deleteConfig(key: string): Promise<void> {
    try {
      await db.delete(systemConfigs).where(eq(systemConfigs.key, key))
      
      this.configCache.delete(key)
      configLogger.info(`配置 ${key} 已删除`)
    } catch (error) {
      configLogger.error(`删除配置 ${key} 失败`, error instanceof Error ? error : new Error(String(error)))
      throw error
    }
  }

  // 获取所有配置（用于管理界面）
  public async getAllConfigs(): Promise<Record<string, any>> {
    const allConfigs: Record<string, any> = {}
    
    for (const [category, items] of Object.entries(CONFIG_TEMPLATES)) {
      allConfigs[category] = {}
      
      for (const item of items) {
        const value = await this.getConfig(item.key, item.defaultValue)
        allConfigs[category][item.key] = {
          ...item,
          value: item.isSensitive ? '********' : value // 敏感信息隐藏
        }
      }
    }
    
    return allConfigs
  }

  // 初始化默认配置
  public async initializeDefaultConfigs(): Promise<void> {
    configLogger.info('初始化默认配置...')
    
    for (const [category, items] of Object.entries(NEW_CONFIG_TEMPLATES)) {
      for (const item of items) {
        const [existing] = await db.select().from(systemConfigs).where(eq(systemConfigs.key, item.key)).limit(1)
        
        if (!existing && item.defaultValue !== undefined) {
          await this.setConfig(item.key, item.defaultValue, item.description)
        }
      }
    }
    
    configLogger.info('默认配置初始化完成')
  }

  // 刷新配置缓存
  public async refreshCache(): Promise<void> {
    this.configCache.clear()
    await this.loadConfigsFromDatabase()
  }

  // 配置验证
  public validateConfig(key: string, value: any): boolean {
    const type = this.getConfigType(key)
    const isRequired = this.isRequiredConfig(key)
    
    if (isRequired && (value === undefined || value === null || value === '')) {
      throw new Error(`配置 ${key} 是必需的`)
    }
    
    try {
      this.validateValue(value, type)
      return true
    } catch (error: any) {
      throw new Error(`配置 ${key} 值无效: ${error.message}`)
    }
  }

  // 私有方法：加密
  private encrypt(text: string): string {
    const algorithm = 'aes-256-cbc'
    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32)
    const iv = crypto.randomBytes(16)
    
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    return iv.toString('hex') + ':' + encrypted
  }

  // 私有方法：解密
  private decrypt(encryptedText: string): string {
    const algorithm = 'aes-256-cbc'
    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32)
    
    const parts = encryptedText.split(':')
    if (parts.length !== 2) {
      throw new Error('无效的加密数据格式')
    }
    
    const iv = Buffer.from(parts[0], 'hex')
    const encrypted = parts[1]
    
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }

  // 私有方法：解析值类型
  private parseValue(value: string, type: ConfigType): any {
    switch (type) {
      case ConfigType.NUMBER:
        return parseInt(value)
      case ConfigType.BOOLEAN:
        return value.toLowerCase() === 'true'
      case ConfigType.JSON:
        return JSON.parse(value)
      default:
        return value
    }
  }

  // 私有方法：验证值
  private validateValue(value: any, type: ConfigType): any {
    switch (type) {
      case ConfigType.STRING:
        return String(value)
      case ConfigType.NUMBER:
        const num = Number(value)
        if (isNaN(num)) throw new Error('值必须是数字')
        return num
      case ConfigType.BOOLEAN:
        return Boolean(value)
      case ConfigType.JSON:
        if (typeof value === 'string') {
          return JSON.parse(value)
        }
        return value
      default:
        return value
    }
  }

  // 私有方法：获取配置类型
  private getConfigType(key: string): ConfigType {
    for (const items of Object.values(CONFIG_TEMPLATES)) {
      const item = items.find(i => i.key === key)
      if (item) return item.type
    }
    return ConfigType.STRING
  }

  // 私有方法：获取配置分类
  private getConfigCategory(key: string): ConfigCategory {
    for (const [category, items] of Object.entries(CONFIG_TEMPLATES)) {
      if (items.find(i => i.key === key)) {
        return category as ConfigCategory
      }
    }
    return ConfigCategory.SYSTEM
  }

  // 私有方法：检查是否为敏感配置
  private isSensitiveConfig(key: string): boolean {
    for (const items of Object.values(CONFIG_TEMPLATES)) {
      const item = items.find(i => i.key === key)
      if (item) return item.isSensitive
    }
    return false
  }

  // 私有方法：检查是否为必需配置
  private isRequiredConfig(key: string): boolean {
    for (const items of Object.values(CONFIG_TEMPLATES)) {
      const item = items.find(i => i.key === key)
      if (item) return item.isRequired
    }
    return false
  }

  // 私有方法：获取配置描述
  private getConfigDescription(key: string): string {
    for (const items of Object.values(CONFIG_TEMPLATES)) {
      const item = items.find(i => i.key === key)
      if (item) return item.description || ''
    }
    return ''
  }
}

// 创建全局配置服务实例
let configService: ConfigService | null = null

export function getConfigService(): ConfigService {
  if (!configService) {
    configService = new ConfigService()
  }
  return configService
}

// 快捷方法
export async function getConfig(key: string, defaultValue?: any): Promise<any> {
  return getConfigService().getConfig(key, defaultValue)
}

export async function setConfig(key: string, value: any, description?: string): Promise<void> {
  return getConfigService().setConfig(key, value, description)
}

export default ConfigService
