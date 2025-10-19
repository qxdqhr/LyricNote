/**
 * 重构后的配置模板
 * 移除了数据库连接配置，这些配置现在通过环境变量管理
 */

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

export interface ConfigItem {
  key: string
  value: any
  category: ConfigCategory
  type: ConfigType
  isRequired: boolean
  isSensitive: boolean
  description?: string
  defaultValue?: any
  group?: string  // 配置分组
  isGroupTemplate?: boolean  // 是否为组模板（可多次实例化）
  groupFields?: string[]  // 组内字段列表（用于多实例配置）
}

export const NEW_CONFIG_TEMPLATES: Record<string, ConfigItem[]> = {
  // 数据库相关的业务配置（非连接配置）
  [ConfigCategory.DATABASE]: [
    {
      key: 'database_pool_size',
      value: 10,
      category: ConfigCategory.DATABASE,
      type: ConfigType.NUMBER,
      isRequired: false,
      isSensitive: false,
      description: '数据库连接池大小',
      defaultValue: 10,
      group: '连接池配置'
    },
    {
      key: 'database_query_timeout',
      value: 30000,
      category: ConfigCategory.DATABASE,
      type: ConfigType.NUMBER,
      isRequired: false,
      isSensitive: false,
      description: '数据库查询超时时间（毫秒）',
      defaultValue: 30000,
      group: '连接池配置'
    },
    {
      key: 'enable_query_logging',
      value: false,
      category: ConfigCategory.DATABASE,
      type: ConfigType.BOOLEAN,
      isRequired: false,
      isSensitive: false,
      description: '启用数据库查询日志',
      defaultValue: false,
      group: '连接池配置'
    },
    {
      key: 'auto_backup_enabled',
      value: true,
      category: ConfigCategory.DATABASE,
      type: ConfigType.BOOLEAN,
      isRequired: false,
      isSensitive: false,
      description: '启用自动备份',
      defaultValue: true,
      group: '备份配置'
    },
    {
      key: 'backup_retention_days',
      value: 30,
      category: ConfigCategory.DATABASE,
      type: ConfigType.NUMBER,
      isRequired: false,
      isSensitive: false,
      description: '备份保留天数',
      defaultValue: 30,
      group: '备份配置'
    },
    {
      key: 'redis_cache_ttl',
      value: 3600,
      category: ConfigCategory.DATABASE,
      type: ConfigType.NUMBER,
      isRequired: false,
      isSensitive: false,
      description: 'Redis缓存默认过期时间（秒）',
      defaultValue: 3600,
      group: '缓存配置'
    }
  ],

  // 存储配置
  [ConfigCategory.STORAGE]: [
    {
      key: 'oss_endpoint',
      value: '',
      category: ConfigCategory.STORAGE,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: false,
      description: 'OSS服务端点',
      group: 'OSS基础配置'
    },
    {
      key: 'oss_region',
      value: 'cn-hangzhou',
      category: ConfigCategory.STORAGE,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: false,
      description: 'OSS区域',
      defaultValue: 'cn-hangzhou',
      group: 'OSS基础配置'
    },
    {
      key: 'oss_bucket_name',
      value: '',
      category: ConfigCategory.STORAGE,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: false,
      description: 'OSS存储桶名称',
      group: 'OSS基础配置'
    },
    {
      key: 'oss_access_key_id',
      value: '',
      category: ConfigCategory.STORAGE,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: false,
      description: 'OSS访问密钥ID',
      group: 'OSS认证配置'
    },
    {
      key: 'oss_access_key_secret',
      value: '',
      category: ConfigCategory.STORAGE,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: true,
      description: 'OSS访问密钥Secret',
      group: 'OSS认证配置'
    },
    {
      key: 'upload_max_size',
      value: 10485760,
      category: ConfigCategory.STORAGE,
      type: ConfigType.NUMBER,
      isRequired: false,
      isSensitive: false,
      description: '最大上传文件大小（字节）',
      defaultValue: 10485760,
      group: '上传配置'
    }
  ],

  // AI服务配置
  [ConfigCategory.AI_SERVICE]: [
    {
      key: 'ai_model_api_key',
      value: '',
      category: ConfigCategory.AI_SERVICE,
      type: ConfigType.STRING,
      isRequired: false,
      isSensitive: false,
      description: 'AI模型API密钥',
      group: '主模型配置'
    },
    {
      key: 'ai_model_api_base_url',
      value: '',
      category: ConfigCategory.AI_SERVICE,
      type: ConfigType.STRING,
      isRequired: false,
      isSensitive: false,
      description: 'AI模型API基础URL',
      group: '主模型配置'
    },
    {
      key: 'ai_model_name',
      value: '',
      category: ConfigCategory.AI_SERVICE,
      type: ConfigType.STRING,
      isRequired: false,
      isSensitive: false,
      description: 'AI模型名称',
      group: '主模型配置'
    },
    {
      key: 'ai_model_description',
      value: '',
      category: ConfigCategory.AI_SERVICE,
      type: ConfigType.STRING,
      isRequired: false,
      isSensitive: false,
      description: 'AI模型描述',
      group: '主模型配置'
    }
  ],

  // 安全配置
  [ConfigCategory.SECURITY]: [
    {
      key: 'jwt_secret',
      value: '',
      category: ConfigCategory.SECURITY,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: true,
      description: 'JWT签名密钥'
    },
    {
      key: 'jwt_expires_in',
      value: '7d',
      category: ConfigCategory.SECURITY,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: false,
      description: 'JWT过期时间',
      defaultValue: '7d'
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
      key: 'encryption_key',
      value: '',
      category: ConfigCategory.SECURITY,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: true,
      description: '配置加密密钥'
    },
    {
      key: 'enable_rate_limiting',
      value: true,
      category: ConfigCategory.SECURITY,
      type: ConfigType.BOOLEAN,
      isRequired: false,
      isSensitive: false,
      description: '启用API速率限制',
      defaultValue: true
    },
    {
      key: 'max_requests_per_minute',
      value: 60,
      category: ConfigCategory.SECURITY,
      type: ConfigType.NUMBER,
      isRequired: false,
      isSensitive: false,
      description: '每分钟最大请求数',
      defaultValue: 60
    }
  ],

  // 移动端配置
  [ConfigCategory.MOBILE]: [
    {
      key: 'expo_project_id',
      value: '',
      category: ConfigCategory.MOBILE,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: false,
      description: 'Expo项目ID'
    },
    {
      key: 'app_version',
      value: '1.0.0',
      category: ConfigCategory.MOBILE,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: false,
      description: '应用版本号',
      defaultValue: '1.0.0'
    },
    {
      key: 'force_update_version',
      value: '',
      category: ConfigCategory.MOBILE,
      type: ConfigType.STRING,
      isRequired: false,
      isSensitive: false,
      description: '强制更新版本'
    },
    {
      key: 'enable_analytics',
      value: true,
      category: ConfigCategory.MOBILE,
      type: ConfigType.BOOLEAN,
      isRequired: false,
      isSensitive: false,
      description: '启用数据分析',
      defaultValue: true
    }
  ],

  // 系统配置
  [ConfigCategory.SYSTEM]: [
    {
      key: 'app_name',
      value: 'LyricNote',
      category: ConfigCategory.SYSTEM,
      type: ConfigType.STRING,
      isRequired: true,
      isSensitive: false,
      description: '应用名称',
      defaultValue: 'LyricNote'
    },
    {
      key: 'app_description',
      value: '专注日语歌曲的AI智能听歌识曲应用',
      category: ConfigCategory.SYSTEM,
      type: ConfigType.STRING,
      isRequired: false,
      isSensitive: false,
      description: '应用描述',
      defaultValue: '专注日语歌曲的AI智能听歌识曲应用'
    },
    {
      key: 'maintenance_mode',
      value: false,
      category: ConfigCategory.SYSTEM,
      type: ConfigType.BOOLEAN,
      isRequired: false,
      isSensitive: false,
      description: '维护模式',
      defaultValue: false
    },
    {
      key: 'enable_registration',
      value: true,
      category: ConfigCategory.SYSTEM,
      type: ConfigType.BOOLEAN,
      isRequired: false,
      isSensitive: false,
      description: '允许用户注册',
      defaultValue: true
    },
    {
      key: 'log_level',
      value: 'info',
      category: ConfigCategory.SYSTEM,
      type: ConfigType.STRING,
      isRequired: false,
      isSensitive: false,
      description: '日志级别',
      defaultValue: 'info'
    }
  ]
}
