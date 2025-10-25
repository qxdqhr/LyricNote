import crypto from 'crypto';
import { db } from '../drizzle/db';
import { systemConfigs, configMetadata } from '../../../drizzle/migrations/schema';
import { eq } from 'drizzle-orm';
import { configLogger } from '../logger';
import { NEW_CONFIG_TEMPLATES } from './config-templates-new';

// 临时保留模板用于过渡
export const CONFIG_TEMPLATES = NEW_CONFIG_TEMPLATES;

// 配置分类枚举
export enum ConfigCategory {
  DATABASE = 'database',
  STORAGE = 'storage',
  AI_SERVICE = 'ai_service',
  EMAIL = 'email',
  SECURITY = 'security',
  SYSTEM = 'system',
  MOBILE = 'mobile',
}

// 配置类型枚举
export enum ConfigType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  JSON = 'json',
}

// 配置项接口
export interface ConfigItem {
  key: string;
  value: any;
  category: ConfigCategory;
  type: ConfigType;
  isRequired: boolean;
  isSensitive: boolean;
  description?: string;
  defaultValue?: any;
}

// 配置管理服务类
export class ConfigService {
  private configCache: Map<string, any> = new Map();
  private metadataCache: Map<
    string,
    {
      category: string;
      type: ConfigType;
      isSensitive: boolean;
      isRequired: boolean;
      defaultDescription?: string;
    }
  > = new Map();
  private encryptionKey: string;

  constructor() {
    // 使用环境变量或默认密钥作为加密密钥
    this.encryptionKey = process.env.CONFIG_ENCRYPTION_KEY || 'lyricnote-config-key-2024';
    this.loadConfigsFromDatabase();
    this.loadMetadataFromDatabase();
  }

  // 从数据库加载元数据
  private async loadMetadataFromDatabase() {
    try {
      const metadata = await db.select().from(configMetadata);
      metadata.forEach((meta) => {
        this.metadataCache.set(meta.key, {
          category: meta.category,
          type: meta.type as ConfigType,
          isSensitive: meta.isSensitive,
          isRequired: meta.isRequired,
          defaultDescription: meta.defaultDescription || undefined,
        });
      });
      configLogger.info(`已加载 ${metadata.length} 条配置元数据`);
    } catch (error) {
      // 如果表不存在，使用模板作为后备
      configLogger.warn(
        '配置元数据表不存在，使用模板数据',
        error instanceof Error ? error.message : String(error)
      );
      // 不抛出错误，继续使用模板
    }
  }

  // 从数据库加载配置到缓存
  private async loadConfigsFromDatabase(): Promise<void> {
    try {
      const configs = await db.select().from(systemConfigs);

      configs.forEach((config) => {
        let value = config.value;

        // 如果是敏感配置，解密
        if (this.isSensitiveConfig(config.key)) {
          try {
            value = this.decrypt(config.value as string);
            configLogger.info(`✅ 成功解密配置: ${config.key}`);
          } catch (error) {
            configLogger.error(`❌ 解密配置失败: ${config.key}`, error);
            // 跳过该配置，不加入缓存
            return;
          }
        }

        this.configCache.set(config.key, value);
      });

      configLogger.info(`已加载 ${configs.length} 个配置项`);
    } catch (error) {
      configLogger.error('加载配置失败', error instanceof Error ? error : new Error(String(error)));
    }
  }

  // 获取配置值
  public async getConfig(key: string, defaultValue?: any): Promise<any> {
    if (!key) {
      return defaultValue;
    }

    // 优先从环境变量获取
    const envValue = process.env[key.toUpperCase()];
    if (envValue !== undefined) {
      return this.parseValue(envValue, this.getConfigType(key));
    }

    // 从缓存获取
    if (this.configCache.has(key)) {
      return this.configCache.get(key);
    }

    // 从数据库获取
    try {
      const [config] = await db
        .select()
        .from(systemConfigs)
        .where(eq(systemConfigs.key, key))
        .limit(1);

      if (config) {
        let value = config.value;

        if (this.isSensitiveConfig(key)) {
          try {
            value = this.decrypt(config.value as string);
            configLogger.info(`✅ 成功解密配置: ${key}, 长度: ${value?.length}`);
          } catch (error) {
            configLogger.error(`❌ 解密配置失败: ${key}`, error);
            throw new Error(`配置 ${key} 解密失败`);
          }
        }

        this.configCache.set(key, value);
        return value;
      }
    } catch (error) {
      configLogger.error(
        `获取配置 ${key} 失败`,
        error instanceof Error ? error : new Error(String(error))
      );
    }

    return defaultValue;
  }

  // 设置配置值
  public async setConfig(key: string, value: any, description?: string): Promise<void> {
    try {
      const category = this.getConfigCategory(key);
      const type = this.getConfigType(key);
      const isSensitive = this.isSensitiveConfig(key);

      // 验证配置值
      const validatedValue = this.validateValue(value, type);

      // 敏感配置需要加密
      const storageValue = isSensitive ? this.encrypt(validatedValue) : validatedValue;

      // 保存到数据库
      const existing = await db
        .select()
        .from(systemConfigs)
        .where(eq(systemConfigs.key, key))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(systemConfigs)
          .set({
            value: storageValue,
            description: description || this.getConfigDescription(key),
            updatedAt: new Date().toISOString(),
          })
          .where(eq(systemConfigs.key, key));
      } else {
        await db.insert(systemConfigs).values({
          id: crypto.randomBytes(16).toString('hex'),
          key,
          value: storageValue,
          description: description || this.getConfigDescription(key),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      // 更新缓存
      this.configCache.set(key, validatedValue);

      configLogger.info(`配置 ${key} 已更新`);
    } catch (error) {
      configLogger.error(
        `设置配置 ${key} 失败`,
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  // 获取分类下的所有配置
  public async getConfigsByCategory(category: ConfigCategory): Promise<Record<string, any>> {
    const configs: Record<string, any> = {};
    const template = CONFIG_TEMPLATES[category] || [];

    for (const item of template) {
      configs[item.key] = await this.getConfig(item.key, item.defaultValue);
    }

    return configs;
  }

  // 批量设置配置
  public async setConfigs(configs: Record<string, any>): Promise<void> {
    for (const [key, value] of Object.entries(configs)) {
      await this.setConfig(key, value);
    }
  }

  // 删除配置
  public async deleteConfig(key: string): Promise<void> {
    try {
      await db.delete(systemConfigs).where(eq(systemConfigs.key, key));

      this.configCache.delete(key);
      configLogger.info(`配置 ${key} 已删除`);
    } catch (error) {
      configLogger.error(
        `删除配置 ${key} 失败`,
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  // 获取所有配置（用于管理界面）
  public async getAllConfigs(): Promise<Record<string, any>> {
    const allConfigs: Record<string, any> = {};

    // 先获取数据库中所有实际存在的配置
    const dbConfigs = await db.select().from(systemConfigs);
    const dbConfigKeys = new Set(dbConfigs.map((c) => c.key));

    for (const [category, items] of Object.entries(CONFIG_TEMPLATES)) {
      allConfigs[category] = {};

      for (const item of items) {
        // 只显示数据库中实际存在的配置
        if (dbConfigKeys.has(item.key)) {
          const value = await this.getConfig(item.key, item.defaultValue);
          allConfigs[category][item.key] = {
            ...item,
            value: item.isSensitive ? '' : value, // 敏感信息隐藏
            isStored: true, // 标记为已存储
          };
        }
      }
    }

    return allConfigs;
  }

  // 获取分类下可用的配置模板（未添加到数据库的配置项）
  public async getAvailableTemplates(category: ConfigCategory): Promise<ConfigItem[]> {
    // 获取数据库中已存在的配置键
    const dbConfigs = await db.select().from(systemConfigs);
    const dbConfigKeys = new Set(dbConfigs.map((c) => c.key));

    // 返回该分类下未在数据库中的模板配置
    const templates = CONFIG_TEMPLATES[category] || [];
    return templates.filter((item) => !dbConfigKeys.has(item.key));
  }

  // 获取所有配置模板（包括已存储和未存储的）
  public async getAllConfigsWithTemplates(): Promise<Record<string, any>> {
    const allConfigs: Record<string, any> = {};

    // 获取数据库中所有实际存在的配置
    const dbConfigs = await db.select().from(systemConfigs);
    const dbConfigKeys = new Set(dbConfigs.map((c) => c.key));

    for (const [category, items] of Object.entries(CONFIG_TEMPLATES)) {
      allConfigs[category] = {
        stored: {}, // 已存储的配置
        available: [], // 可添加的配置模板
      };

      for (const item of items) {
        if (dbConfigKeys.has(item.key)) {
          // 已存储的配置
          const value = await this.getConfig(item.key, item.defaultValue);
          allConfigs[category].stored[item.key] = {
            ...item,
            value: item.isSensitive ? '' : value,
            isStored: true,
          };
        } else {
          // 未存储的模板
          allConfigs[category].available.push({
            ...item,
            value: item.defaultValue,
            isStored: false,
          });
        }
      }
    }

    return allConfigs;
  }

  // 初始化默认配置
  public async initializeDefaultConfigs(): Promise<void> {
    configLogger.info('初始化默认配置...');

    for (const [category, items] of Object.entries(NEW_CONFIG_TEMPLATES)) {
      for (const item of items) {
        const [existing] = await db
          .select()
          .from(systemConfigs)
          .where(eq(systemConfigs.key, item.key))
          .limit(1);

        if (!existing && item.defaultValue !== undefined) {
          await this.setConfig(item.key, item.defaultValue, item.description);
        }
      }
    }

    configLogger.info('默认配置初始化完成');
  }

  // 刷新配置缓存
  public async refreshCache(): Promise<void> {
    this.configCache.clear();
    await this.loadConfigsFromDatabase();
  }

  // 配置验证
  public validateConfig(key: string, value: any): boolean {
    const type = this.getConfigType(key);
    const isRequired = this.isRequiredConfig(key);

    if (isRequired && (value === undefined || value === null || value === '')) {
      throw new Error(`配置 ${key} 是必需的`);
    }

    try {
      this.validateValue(value, type);
      return true;
    } catch (error: any) {
      throw new Error(`配置 ${key} 值无效: ${error.message}`);
    }
  }

  // 私有方法：加密
  private encrypt(text: string): string {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
  }

  // 私有方法：解密
  private decrypt(encryptedText: string): string {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);

    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      throw new Error('无效的加密数据格式');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  // 私有方法：解析值类型
  private parseValue(value: string, type: ConfigType): any {
    switch (type) {
      case ConfigType.NUMBER:
        return parseInt(value);
      case ConfigType.BOOLEAN:
        return value.toLowerCase() === 'true';
      case ConfigType.JSON:
        return JSON.parse(value);
      default:
        return value;
    }
  }

  // 私有方法：验证值
  private validateValue(value: any, type: ConfigType): any {
    switch (type) {
      case ConfigType.STRING:
        return String(value);
      case ConfigType.NUMBER:
        const num = Number(value);
        if (isNaN(num)) throw new Error('值必须是数字');
        return num;
      case ConfigType.BOOLEAN:
        return Boolean(value);
      case ConfigType.JSON:
        if (typeof value === 'string') {
          return JSON.parse(value);
        }
        return value;
      default:
        return value;
    }
  }

  // 私有方法：获取配置类型
  private getConfigType(key: string): ConfigType {
    const metadata = this.metadataCache.get(key);
    return metadata?.type || ConfigType.STRING;
  }

  // 私有方法：获取配置分类
  private getConfigCategory(key: string): ConfigCategory {
    const metadata = this.metadataCache.get(key);
    return (metadata?.category as ConfigCategory) || ConfigCategory.SYSTEM;
  }

  // 私有方法：检查是否为敏感配置
  private isSensitiveConfig(key: string): boolean {
    const metadata = this.metadataCache.get(key);
    return metadata?.isSensitive || false;
  }

  // 私有方法：检查是否为必需配置
  private isRequiredConfig(key: string): boolean {
    const metadata = this.metadataCache.get(key);
    return metadata?.isRequired || false;
  }

  // 私有方法：获取配置描述
  private getConfigDescription(key: string): string {
    const metadata = this.metadataCache.get(key);
    return metadata?.defaultDescription || '';
  }

  // 新增方法：创建或更新配置元数据
  public async setConfigMetadata(
    key: string,
    category: string,
    type: ConfigType = ConfigType.STRING,
    options: {
      isSensitive?: boolean;
      isRequired?: boolean;
      defaultDescription?: string;
    } = {}
  ): Promise<void> {
    try {
      const now = new Date().toISOString();
      const existing = await db
        .select()
        .from(configMetadata)
        .where(eq(configMetadata.key, key))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(configMetadata)
          .set({
            category,
            type,
            isSensitive: options.isSensitive ?? false,
            isRequired: options.isRequired ?? false,
            defaultDescription: options.defaultDescription,
            updatedAt: now,
          })
          .where(eq(configMetadata.key, key));
      } else {
        await db.insert(configMetadata).values({
          key,
          category,
          type,
          isSensitive: options.isSensitive ?? false,
          isRequired: options.isRequired ?? false,
          defaultDescription: options.defaultDescription,
          createdAt: now,
          updatedAt: now,
        });
      }

      // 更新缓存
      this.metadataCache.set(key, {
        category,
        type,
        isSensitive: options.isSensitive ?? false,
        isRequired: options.isRequired ?? false,
        defaultDescription: options.defaultDescription,
      });

      configLogger.info(`配置元数据 ${key} 已更新`);
    } catch (error) {
      configLogger.error(
        `设置配置元数据 ${key} 失败`,
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }
}

// 创建全局配置服务实例
let configService: ConfigService | null = null;

export function getConfigService(): ConfigService {
  if (!configService) {
    configService = new ConfigService();
  }
  return configService;
}

// 快捷方法
export async function getConfig(key: string, defaultValue?: any): Promise<any> {
  return getConfigService().getConfig(key, defaultValue);
}

export async function setConfig(key: string, value: any, description?: string): Promise<void> {
  return getConfigService().setConfig(key, value, description);
}

export default ConfigService;
