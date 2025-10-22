/**
 * Analytics SDK 主入口
 * Main Entry Point for Analytics SDK
 */

// 核心类
export { Analytics } from './core/Analytics';
export { EventQueue } from './core/EventQueue';
export { Uploader } from './core/Uploader';

// 类型定义
export * from './types';

// 平台适配器
export * from './adapters/web';
export * from './adapters/mobile';
export * from './adapters/miniapp';
export * from './adapters/desktop';

// 客户端单例和预设
export * from './client';

// 工具函数
export * from './utils/helpers';
export * from './utils/decorators';
export * from './utils/hooks';

// 版本信息
export const ANALYTICS_VERSION = '1.0.0';
