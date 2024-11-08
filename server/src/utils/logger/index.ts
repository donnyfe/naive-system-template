import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { join } from 'path'

// 日志级别定义
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

// 日志类型定义
export enum LogType {
  SYSTEM = 'system',    // 系统日志
  BUSINESS = 'business', // 业务日志
  SECURITY = 'security', // 安全日志
  PERFORMANCE = 'performance', // 性能日志
  DIAGNOSTIC = 'diagnostic'  // 诊断日志
}

// 日志配置接口
interface LogConfig {
  level: LogLevel
  type: LogType
  filename: string
  maxSize: string
  maxFiles: string
  dirname: string
}

// 默认配置
const defaultConfig: LogConfig = {
  level: LogLevel.INFO,
  type: LogType.SYSTEM,
  filename: '%DATE%.log',
  maxSize: '20m',
  maxFiles: '14d',
  dirname: join(process.cwd(), 'logs')
}

// 创建日志记录器
export class Logger {
  private static instance: Logger
  private logger: any

  private constructor(config: LogConfig = defaultConfig) {
    // 创建Winston日志记录器
    this.logger = createLogger({
      level: config.level,
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
      ),
      defaultMeta: {
        type: config.type,
        env: process.env.NODE_ENV
      },
      transports: [
        // 控制台输出
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple()
          )
        }),
        // 文件输出
        new DailyRotateFile({
          filename: join(config.dirname, config.type, config.filename),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: config.maxSize,
          maxFiles: config.maxFiles
        })
      ]
    })
  }

  // 单例模式获取实例
  public static getInstance(config?: LogConfig): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(config)
    }
    return Logger.instance
  }

  // 日志记录方法
  public error(message: string, meta?: any): void {
    this.logger.error(message, meta)
  }

  public warn(message: string, meta?: any): void {
    this.logger.warn(message, meta)
  }

  public info(message: string, meta?: any): void {
    this.logger.info(message, meta)
  }

  public debug(message: string, meta?: any): void {
    this.logger.debug(message, meta)
  }

  // 自定义日志方法
  public log(level: LogLevel, message: string, meta?: any): void {
    this.logger.log(level, message, meta)
  }
}

// 导出默认实例
export default Logger.getInstance()


/**
 * 使用示例
import logger from '@/utils/logger'

// 基础用法
logger.info('User logged in', { userId: 123 })
logger.error('Database connection failed', { error })

// 自定义日志
logger.log(LogLevel.INFO, 'Custom log', { custom: 'data' })

// Express中间件
app.use(requestLogger)
app.use(errorLogger)
 */
