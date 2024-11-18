import { Module, DynamicModule, Global } from '@nestjs/common'
import { LoggerService } from './logger.service'
import { LoggerOptions } from './logger.interface'

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {
  static forRoot(options: LoggerOptions): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: 'LOGGER_OPTIONS',
          useValue: options,
        },
        LoggerService,
      ],
      exports: [LoggerService],
      global: true,
    }
  }
}
