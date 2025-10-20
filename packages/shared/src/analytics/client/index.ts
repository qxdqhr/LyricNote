/**
 * Analytics 客户端
 * Analytics Client
 * 
 * 导出单例管理器和预设配置
 */

// 单例管理器
export {
  createAnalytics,
  getAnalyticsInstance,
  resetAnalytics,
  resetAllAnalytics,
  isAnalyticsInitialized,
  getAllInstanceKeys,
} from './singleton'

// 预设配置
export {
  getWebAdminAnalytics,
  getWebFrontendAnalytics,
} from './presets'

export type {
  WebAdminConfig,
  WebFrontendConfig,
} from './presets'

