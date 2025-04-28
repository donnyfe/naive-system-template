import { Injectable, Inject, LoggerService as NestLoggerService } from '@nestjs/common'
import * as winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { LoggerOptions } from './logger.interface'

const isProduction = process.env.NODE_ENV === 'production'

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger

  constructor(@Inject('LOGGER_OPTIONS') private options: LoggerOptions) {
    this.initLogger()
  }

  private initLogger() {
    // 通用日志格式
    const commonFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),

      this.options.json
        ? winston.format.json()
        : winston.format.printf(({ timestamp, level, message, metadata }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message} ${Object.keys(metadata).length ? JSON.stringify(metadata) : ''}`
          }),
    )

    const transports = []

    // 控制台输出
    transports.push(
      new winston.transports.Console({
        format: commonFormat,
      }),
    )

    // 应用日志
    transports.push(
      new DailyRotateFile({
        filename: `${this.options.file.path}/app-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        maxFiles: this.options.file.maxFiles,
        maxSize: this.options.file.maxSize,
        format: commonFormat,
      }),
    )

    // 错误日志单独存储
    transports.push(
      new DailyRotateFile({
        filename: `${this.options.file.path}/error-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        maxFiles: this.options.file.maxFiles,
        maxSize: this.options.file.maxSize,
        level: 'error',
        format: commonFormat,
      }),
    )

    // HTTP访问日志
    if (this.options.requestLogging?.enabled) {
      transports.push(
        new DailyRotateFile({
          filename: `${this.options.file.path}/access-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          maxFiles: this.options.file.maxFiles,
          maxSize: this.options.file.maxSize,
          level: 'http',
          format: commonFormat,
        }),
      )
    }

    this.logger = winston.createLogger({
      level: isProduction ? 'info' : 'debug',
      levels: winston.config.npm.levels,
      transports,
    })
  }

  log(message: string, context?: string, data?: any) {
    this.logger.info(message, { context, ...data })
  }

  error(message: string, context?: string, trace?: Error | unknown, data?: any) {
    this.logger.error(message, { context, trace, ...data })
  }

  warn(message: string, context?: string, data?: any) {
    this.logger.warn(message, { context, ...data })
  }

  debug(message: string, context?: string, data?: any) {
    this.logger.debug(message, { context, ...data })
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context })
  }
}
