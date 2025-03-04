import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MailerModule } from '@nestjs-modules/mailer'
import { MulterModule } from '@nestjs/platform-express'
import { RedisModule } from './redis/redis.module'
import { DatabaseModule } from './database/database.module'
import { HttpClientModule } from './http-client/http-client.module'
import { validationSchema } from './config/validation.schema'
import { LoggerModule } from '@/core/logger/logger.module'
import * as configs from './config/configurations'
import { EmailModule } from './email/email.module'

const isProduction = process.env.NODE_ENV === 'production'

@Module({
  imports: [
    // 应用配置
    ConfigModule.forRoot({
      isGlobal: true,
      load: Object.values(configs),
      validationSchema,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    // 日志
    LoggerModule.forRoot({
      json: isProduction,
      logLevel: isProduction
        ? ['log', 'error', 'warn']
        : ['log', 'error', 'warn', 'debug', 'verbose'],
      file: {
        enabled: true,
        path: process.env.LOG_PATH || 'logs', // 可配置的日志路径
        maxFiles: '30d', // 保留30天的日志
        maxSize: '20m',
      },
      requestLogging: {
        enabled: true,
        headers: true,
        ignorePaths: ['/health'],
      },
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
    // 邮件
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // transport: 'smtps://user@domain.com:pass@smtp.domain.com',
        // pass: 邮箱授权码，见邮箱设置 -> 账户 -> 开启IMAP/SMTP服务 -> 生成授权码
        transport: configService.get('email.transport'),
        defaults: {
          from: configService.get('email.from'),
        },
        // 配置邮件模板
        // template: {
        //   dir: __dirname + '/templates',
        //   options: {
        //     strict: true,
        //   },
        // },
      }),
    }),
    // 数据库
    DatabaseModule,
    // Redis
    RedisModule,
    // HTTP客户端
    HttpClientModule,
    // 邮件
    EmailModule,
  ],
  exports: [ConfigModule, DatabaseModule, RedisModule, HttpClientModule, EmailModule],
})
export class CoreModule {}
