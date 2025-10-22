/**
 * 敏感配置掩码处理
 *
 * 防止敏感信息在前端明文传输和显示
 */

export interface ConfigItem {
  key: string;
  value: any;
  type: string;
  isRequired: boolean;
  isSensitive: boolean;
  description?: string;
  masked?: boolean;
  originalLength?: number;
  readonly?: boolean;
}

/**
 * 掩码敏感值
 *
 * 策略：
 * - 短于6个字符：全部显示星号
 * - 6-20个字符：显示前2位和后2位
 * - 长于20个字符：显示前4位和后4位
 */
export function maskSensitiveValue(value: string): string {
  if (!value) return '';

  const length = value.length;

  if (length <= 6) {
    return '*'.repeat(length);
  } else if (length <= 20) {
    const prefix = value.substring(0, 2);
    const suffix = value.substring(length - 2);
    const middle = '*'.repeat(Math.max(length - 4, 3));
    return `${prefix}${middle}${suffix}`;
  } else {
    const prefix = value.substring(0, 4);
    const suffix = value.substring(length - 4);
    const middle = '*'.repeat(12);
    return `${prefix}${middle}${suffix}`;
  }
}

/**
 * 检查值是否为掩码值
 */
export function isMaskedValue(value: string, originalValue: string): boolean {
  if (!value || !originalValue) return false;
  const masked = maskSensitiveValue(originalValue);
  return value === masked;
}

/**
 * 处理配置对象，对敏感字段进行掩码
 */
export function maskConfigs(configs: Record<string, ConfigItem>): Record<string, ConfigItem> {
  const masked: Record<string, ConfigItem> = {};

  for (const [key, config] of Object.entries(configs)) {
    if (config.isSensitive && typeof config.value === 'string' && config.value) {
      masked[key] = {
        ...config,
        value: maskSensitiveValue(config.value),
        masked: true,
        originalLength: config.value.length,
      };
    } else {
      masked[key] = config;
    }
  }

  return masked;
}

/**
 * 处理所有分类的配置
 */
export function maskAllConfigs(
  allConfigs: Record<string, Record<string, ConfigItem>>
): Record<string, Record<string, ConfigItem>> {
  const masked: Record<string, Record<string, ConfigItem>> = {};

  for (const [category, configs] of Object.entries(allConfigs)) {
    masked[category] = maskConfigs(configs);
  }

  return masked;
}
