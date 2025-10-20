/**
 * Analytics 预设配置
 * Analytics Preset Configurations
 * 
 * 为不同平台和应用提供预配置的 Analytics 实例
 */

import { createAnalytics } from './singleton'
import { webAdapter } from '../adapters/web'
import type { Analytics } from '../core/Analytics'

/**
 * Web 管理后台 Analytics 配置
 */
export interface WebAdminConfig {
  endpoint?: string
  debug?: boolean
  enableAutoPageView?: boolean
}

/**
 * 获取 Web 管理后台 Analytics 实例
 */
export function getWebAdminAnalytics(config: WebAdminConfig = {}): Analytics {
  return createAnalytics('web-admin', {
    appId: 'lyricnote-admin',
    appVersion: '1.0.0',
    endpoint: config.endpoint || '/api/analytics/events',
    platform: 'web',
    adapter: webAdapter,
    enableAutoPageView: config.enableAutoPageView ?? false,
    debug: config.debug ?? (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'),
  } as any)
}

/**
 * Web 前台 Analytics 配置
 */
export interface WebFrontendConfig {
  endpoint?: string
  debug?: boolean
  enableAutoPageView?: boolean
}

/**
 * 获取 Web 前台 Analytics 实例
 */
export function getWebFrontendAnalytics(config: WebFrontendConfig = {}): Analytics {
  return createAnalytics('web-frontend', {
    appId: 'lyricnote-web',
    appVersion: '1.0.0',
    endpoint: config.endpoint || '/api/analytics/events',
    platform: 'web',
    adapter: webAdapter,
    enableAutoPageView: config.enableAutoPageView ?? true,
    debug: config.debug ?? (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'),
  } as any)
}

// Note: Mobile 和 Miniapp 的预设配置需要在各自的项目中根据实际情况创建
// 因为它们需要注入平台特定的适配器实例（如 AsyncStorage, Taro API 等）

