import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

/**
 * 配置跨域
 * @param app 应用实例
 * @param isProduction 是否生产环境
 */
export const setupCors = async (app: INestApplication, isProduction: boolean) => {
  const configService = app.get(ConfigService)
  const allowedOrigins = configService.get('allowedOrigins')

  app.enableCors({
    origin: isProduction ? allowedOrigins : true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Authorization',
      'Content-Type',
      'Accept',
      'Origin',
      'X-Requested-With',
      'X-CSRF-Token',
      'x-csrf-token',
      'X-Forwarded-For',
      'X-Real-IP',
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range', 'X-CSRF-Token'],
    maxAge: 3600,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
}
