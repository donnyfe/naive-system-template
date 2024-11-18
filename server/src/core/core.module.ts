import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { RedisModule } from './redis/redis.module';
import { DatabaseModule } from './database/database.module';
import { HttpClientModule } from './http-client/http-client.module';
import { validationSchema } from './config/validation.schema';
import { LoggerModule } from '@/core/logger/logger.module';
import * as configs from './config/configurations';


@Module({
  imports: [
    // 应用配置
    ConfigModule.forRoot({
      isGlobal: true,
      load: Object.values(configs),
      validationSchema,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    // 文件上传
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dest: configService.get('upload.dest'), // 从配置中获取上传目录
        limits: {
          fileSize: configService.get('upload.maxSize'), // 从配置中获取上传文件大小限制
        },
      }),
    }),
    // 日志
    LoggerModule.forRoot({
      json: true,
      logLevel: ['log', 'error', 'warn'],
      file: {
        enabled: true,
        path: 'logs/app.log',
        maxFiles: 30,
        maxSize: '20m',
      },
      requestLogging: {
        enabled: true,
        headers: true,
        ignorePaths: ['/health'],
      },
    }),
    // 数据库
    DatabaseModule,
    // Redis
    RedisModule,
    // HTTP客户端
    HttpClientModule,
  ],
  exports: [ConfigModule, DatabaseModule, RedisModule, HttpClientModule],
})
export class CoreModule {}
