// 注入令牌
export const LOGGER_OPTIONS = 'LOGGER_OPTIONS'

// 日志级别枚举
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

// 日志类型枚举
export enum LogType {
  SYSTEM = 'system', // 系统日志
  BUSINESS = 'business', // 业务日志
  ACCESS = 'access', // 访问日志
  SECURITY = 'security', // 安全日志
  PERFORMANCE = 'performance', // 性能日志
  DIAGNOSTIC = 'diagnostic', // 诊断日志
}

// 默认日志格式
export const DEFAULT_LOG_FORMAT = {
  timestamp: 'YYYY-MM-DD HH:mm:ss',
  label: true,
  json: true,
}

// 默认文件配置
export const DEFAULT_FILE_CONFIG = {
  enabled: true,
  path: 'logs/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  zippedArchive: true,
}

// 默认控制台配置
export const DEFAULT_CONSOLE_CONFIG = {
  enabled: true,
  colorize: true,
}

// 日志颜色配置
export const LOG_COLORS = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
  verbose: 'gray',
}

// 日志级别权重
export const LOG_LEVEL_WEIGHT = {
  [LogLevel.ERROR]: 0,
  [LogLevel.WARN]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.DEBUG]: 3,
  [LogLevel.VERBOSE]: 4,
}

// 默认日志配置
export const DEFAULT_LOGGER_OPTIONS = {
  level: LogLevel.INFO,
  type: LogType.SYSTEM,
  format: DEFAULT_LOG_FORMAT,
  file: DEFAULT_FILE_CONFIG,
  console: DEFAULT_CONSOLE_CONFIG,
}

// 上下文键名
export const CONTEXT_KEYS = {
  REQUEST_ID: 'requestId',
  USER_ID: 'userId',
  IP: 'ip',
  USER_AGENT: 'userAgent',
  TIMESTAMP: 'timestamp',
} as const

// 日志文件路径模板
export const LOG_PATH_TEMPLATES = {
  [LogType.SYSTEM]: 'logs/system/%DATE%.log',
  [LogType.BUSINESS]: 'logs/business/%DATE%.log',
  [LogType.ACCESS]: 'logs/access/%DATE%.log',
  [LogType.SECURITY]: 'logs/security/%DATE%.log',
  [LogType.PERFORMANCE]: 'logs/performance/%DATE%.log',
  [LogType.DIAGNOSTIC]: 'logs/diagnostic/%DATE%.log',
} as const

// 日志消息模板
export const LOG_MESSAGE_TEMPLATES = {
  REQUEST_START: '[Request Start] ${method} ${url}',
  REQUEST_END: '[Request End] ${method} ${url} ${statusCode} ${duration}ms',
  ERROR: '[Error] ${message}',
  WARN: '[Warning] ${message}',
  INFO: '[Info] ${message}',
  DEBUG: '[Debug] ${message}',
  VERBOSE: '[Verbose] ${message}',
} as const
