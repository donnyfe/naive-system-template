import { DynamicModule, Global, Module } from '@nestjs/common'
import { LOGGER_OPTIONS } from '@/common/constants/logger'
import { LoggerService } from './logger.service'
import { LoggerOptions } from './logger.interface'

@Global()
@Module({})
export class LoggerModule {
  static forRoot(options?: LoggerOptions): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: LOGGER_OPTIONS,
          useValue: options || {},
        },
        LoggerService,
      ],
      exports: [LoggerService],
    }
  }
}
