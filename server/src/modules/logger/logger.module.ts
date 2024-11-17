import { Module, DynamicModule } from '@nestjs/common'
import { LoggerService } from './logger.service'
import { LoggerOptions } from './logger.interface'

@Module({})
export class LoggerModule {
  static forRoot(options: LoggerOptions): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: LoggerService,
          useFactory: () => {
            return new LoggerService(options);
          }
        }
      ],
      exports: [LoggerService]
    }
  }
}
