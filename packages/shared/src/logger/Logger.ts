import { LogLevel, LogEntry, LoggerConfig, LoggerAdapter } from './types';
import { ConsoleLoggerAdapter } from './console-adapter';

/**
 * 统一日志管理类
 */
export class Logger {
  private config: Required<LoggerConfig>;
  private adapter: LoggerAdapter;
  private context?: string;

  constructor(config?: Partial<LoggerConfig>, context?: string) {
    this.config = {
      minLevel:
        config?.minLevel ??
        (process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG),
      enableTimestamp: config?.enableTimestamp ?? true,
      enableContext: config?.enableContext ?? true,
      environment:
        config?.environment ??
        (process.env.NODE_ENV as 'development' | 'production') ??
        'development',
      adapter: config?.adapter ?? new ConsoleLoggerAdapter(),
    };
    this.adapter = this.config.adapter;
    this.context = context;
  }

  /**
   * 创建带上下文的子 Logger
   */
  createChild(context: string): Logger {
    return new Logger(this.config, context);
  }

  /**
   * 调试日志
   */
  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * 信息日志
   */
  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * 警告日志
   */
  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * 错误日志
   */
  error(message: string, error?: Error | any): void {
    this.log(
      LogLevel.ERROR,
      message,
      error instanceof Error ? undefined : error,
      error instanceof Error ? error : undefined
    );
  }

  /**
   * 核心日志方法
   */
  private log(level: LogLevel, message: string, data?: any, error?: Error): void {
    // 检查日志级别
    if (level < this.config.minLevel) {
      return;
    }

    // 检查动态调试配置（仅在浏览器环境）
    if (typeof window !== 'undefined') {
      const loggerDebug = localStorage.getItem('logger-debug');
      // 如果明确设置为 false，则不输出（但 Error 级别始终输出）
      if (loggerDebug === 'false' && level < LogLevel.ERROR) {
        return;
      }
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: this.config.enableTimestamp ? new Date() : (undefined as any),
      data,
      context: this.config.enableContext ? this.context : undefined,
      error,
    };

    this.adapter.log(entry);
  }

  /**
   * 设置日志级别
   */
  setLevel(level: LogLevel): void {
    this.config.minLevel = level;
  }

  /**
   * 获取当前日志级别
   */
  getLevel(): LogLevel {
    return this.config.minLevel;
  }
}

/**
 * 默认全局 Logger 实例
 */
export const logger = new Logger();

/**
 * 创建带上下文的 Logger
 */
export function createLogger(context: string, config?: Partial<LoggerConfig>): Logger {
  return new Logger(config, context);
}
