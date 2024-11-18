import { Injectable, Inject, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { LoggerOptions } from './logger.interface';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor(
    @Inject('LOGGER_OPTIONS') private options: LoggerOptions
  ) {
    this.initLogger();
  }

  private initLogger() {
    const transports = [];

    // 控制台输出
    transports.push(
      new winston.transports.Console({
        format: this.options.json
          ? winston.format.json()
          : winston.format.simple()
      })
    );

    // 文件输出
    if (this.options.file?.enabled) {
      transports.push(
        new winston.transports.File({
          filename: this.options.file.path,
          maxFiles: this.options.file.maxFiles,
          maxsize: parseInt(this.options.file.maxSize)
        })
      );
    }

    this.logger = winston.createLogger({
      level: 'info',
      transports
    });
  }

  log(message: string, context?: string, data?: any) {
    this.logger.log(message, { context, data });
  }

  error(message: string, trace?: Error | unknown, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
