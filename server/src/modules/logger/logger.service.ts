import { Inject, Injectable,  Optional } from '@nestjs/common'
import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { LOGGER_OPTIONS } from '@/common/constants/logger'
import { LoggerOptions, LogType } from './logger.interface'

@Injectable()
export class LoggerService {
  private logger: any

  constructor(@Optional() @Inject(LOGGER_OPTIONS) private options: LoggerOptions = {}) {
    this.initializeLogger()
  }

  private initializeLogger() {
    const {
      level = 'info',
      type = LogType.SYSTEM,
      file = {
        enabled: true,
        path: 'logs/%DATE%.log',
        maxSize: '20m',
        maxFiles: '14d',
        zippedArchive: true,
      },
      console = {
        enabled: true,
        colorize: true,
      },
      format: formatOptions = {
        timestamp: true,
        label: true,
      },
    } = this.options

    // 配置日志格式
    const logFormat = format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json(),
    )

    const loggerTransports = []

    // 添加控制台输出
    if (console.enabled) {
      loggerTransports.push(
        new transports.Console({
          format: format.combine(format.colorize({ all: console.colorize }), format.simple()),
        }),
      )
    }

    // 添加文件输出
    if (file.enabled) {
      loggerTransports.push(
        new DailyRotateFile({
          filename: file.path,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: file.zippedArchive,
          maxSize: file.maxSize,
          maxFiles: file.maxFiles,
        }),
      )
    }

    this.logger = createLogger({
      level,
      format: logFormat,
      defaultMeta: {
        type,
        env: process.env.NODE_ENV,
      },
      transports: loggerTransports,
    })
  }

  log(message: string, context?: string, meta?: any) {
    this.logger.info(message, { context, ...meta })
  }

  error(message: string, trace?: string, context?: string, meta?: any) {
    this.logger.error(message, { trace, context, ...meta })
  }

  warn(message: string, context?: string, meta?: any) {
    this.logger.warn(message, { context, ...meta })
  }

  debug(message: string, context?: string, meta?: any) {
    this.logger.debug(message, { context, ...meta })
  }

  verbose(message: string, context?: string, meta?: any) {
    this.logger.verbose(message, { context, ...meta })
  }
}
