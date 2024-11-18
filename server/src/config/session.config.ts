import { ConfigService } from '@nestjs/config'
import { SessionOptions } from 'express-session'
import RedisStore from 'connect-redis'
import { RedisService } from '@/core/redis/redis.service'

export const createSessionConfig = (
  configService: ConfigService,
  redisService: RedisService,
): SessionOptions => {
  const sessionConfig = configService.get('security.session')
  const cookieConfig = configService.get('security.cookie')
  const redisConfig = configService.get('redis')

  return {
    store: new RedisStore({
      client: redisService.getClient(),
      prefix: redisConfig.prefix,
      ttl: redisConfig.ttl,
    }),
    secret: sessionConfig.secret,
    name: sessionConfig.name,
    rolling: true,
    cookie: cookieConfig,
    resave: false,
    saveUninitialized: false,
    proxy: process.env.NODE_ENV === 'production',
    unset: 'destroy',
  }
}
