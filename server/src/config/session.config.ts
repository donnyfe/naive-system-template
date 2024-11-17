import { ConfigService } from '@nestjs/config'
import { SessionOptions } from 'express-session'
import RedisStore from 'connect-redis'
import { RedisService } from '../shared/redis.service'

export const createSessionConfig = (
  configService: ConfigService,
  redisService: RedisService,
): SessionOptions => {
  const isProduction = process.env.NODE_ENV === 'production'

  const redisStore = new RedisStore({
    client: redisService['redisClient'],
    prefix: 'sess:',
    ttl: configService.get('redis.session.ttl', 86400),
    // 添加错误处理
    logErrors: true,
    retryStrategy: (times: number) => {
      if (times > 3) {
        throw new Error('Redis session store retry failed')
      }
      return Math.min(times * 100, 3000)
    },
  })

  return {
    store: redisStore,
    secret: configService.get('session.secret'),
    name: 'sessionId', // 更改默认cookie名
    rolling: true,
    cookie: {
      httpOnly: true,
      // secure: isProduction, // 生产环境开启https
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      // sameSite: isProduction ? 'strict' : 'lax',
      sameSite: 'lax',
      path: '/',
      domain: configService.get('cookie.domain'),
    },
    resave: false,
    saveUninitialized: false,
    // 添加安全选项
    proxy: isProduction,
    unset: 'destroy',
  }
}
