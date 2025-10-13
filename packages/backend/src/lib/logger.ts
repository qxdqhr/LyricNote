/**
 * Backend 日志管理
 * 使用 shared 包的统一日志系统
 */

import { createLogger, LogLevel } from '@lyricnote/shared'

// 创建全局 Logger 实例
export const logger = createLogger('Backend', {
  minLevel: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  enableTimestamp: true,
  enableContext: true,
})

// 为不同模块创建专用 Logger
export const apiLogger = logger.createChild('API')
export const authLogger = logger.createChild('Auth')
export const configLogger = logger.createChild('Config')
export const dbLogger = logger.createChild('Database')
export const aiLogger = logger.createChild('AI')

export default logger

