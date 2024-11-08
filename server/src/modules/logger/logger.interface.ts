import { LogLevel } from '@nestjs/common'

export enum LogType {
  SYSTEM = 'system',
  BUSINESS = 'business',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  DIAGNOSTIC = 'diagnostic',
}

export interface LoggerOptions {
  // 日志级别
  level?: LogLevel
  // 日志类型
  type?: LogType
  // 日志文件配置
  file?: {
    enabled: boolean
    path: string
    maxSize: string
    maxFiles: string
    zippedArchive: boolean
  }
  // 控制台配置
  console?: {
    enabled: boolean
    colorize: boolean
  }
  // 格式化配置
  format?: {
    timestamp: boolean
    label: boolean
  }
}
