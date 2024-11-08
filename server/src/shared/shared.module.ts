import { Global, Module, ValidationPipe } from '@nestjs/common'
import { SharedService } from './shared.service'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { TransformInterceptor } from '@/common/interceptors/response.interceptor'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RedisService } from './redis.service'
import { createClient } from 'redis'
import { HttpModule } from '@nestjs/axios'
import { MulterModule } from '@nestjs/platform-express'

@Global()
@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // 设置文件上传的目录
    }),

    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          baseURL: '', // configService.get('http.host'),
          timeout: 5000,
          maxRedirects: 5,
        }
      },
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('mysql.host'),
          port: configService.get('mysql.port'),
          username: configService.get('mysql.username'),
          password: configService.get('mysql.password'),
          database: configService.get('mysql.database'),
          synchronize: process.env.NODE_ENV === 'production' ? false : configService.get('mysql.sync'),
          autoLoadEntities: true,
          timezone: '+08:00',
        }
      },
    }),
  ],
  providers: [
    SharedService,
    RedisService,
    {
      inject: [ConfigService],
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = createClient({
          url: configService.get('redis.url'),
        })
        await client.connect()
        return client
      },
    },
    {
      // 全局拦截器
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      //全局参数校验管道
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true, // 自动类型转换
      }),
    },
  ],
  exports: [SharedService, RedisService],
})
export class SharedModule {}
