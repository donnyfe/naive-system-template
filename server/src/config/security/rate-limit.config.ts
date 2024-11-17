import { INestApplication } from '@nestjs/common'
import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import { RedisService } from '@/shared/redis.service'

export const setupRateLimit = async (app: INestApplication, isProduction: boolean) => {
  const redisService = app.get(RedisService)

  app.use(
    rateLimit({
      store: new RedisStore({
        sendCommand: (...args: string[]) => redisService['redisClient'].sendCommand(args),
      }),
      windowMs: 15 * 60 * 1000,
      max: isProduction ? 100 : 1000,
      message: '请求频率超限，请稍后再试',
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: false,
      keyGenerator: (req) => {
        const forwardedFor = req.headers['x-forwarded-for']
        const clientIp = typeof forwardedFor === 'string'
          ? forwardedFor.split(',')[0].trim()
          : forwardedFor?.[0]
        return req.ip || clientIp || req.socket.remoteAddress
      },
    })
  )
}
