import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export const setupCors = async (app: INestApplication, configService: ConfigService) => {
  const isProduction = process.env.NODE_ENV === 'production'
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
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range', 'X-CSRF-Token'],
    maxAge: 3600,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
}
