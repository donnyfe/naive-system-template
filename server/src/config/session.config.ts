import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import session from 'express-session'
import { RedisStore } from 'connect-redis'


/**
 * 设置session
 * @param app
 */
export async function setupSession(app: INestApplication, redisStore: RedisStore): Promise<void> {
  const configService = app.get(ConfigService)
  const securityConfig = configService.get('security')

  const conf = {
    store: redisStore,
    secret: securityConfig.session.secret,
    name: securityConfig.session.name,
    rolling: true,
    cookie: {
      ...securityConfig.cookie,
      httpOnly: true,
      sameSite: 'lax',
    },
    resave: false,
    saveUninitialized: true,
    proxy: process.env.NODE_ENV === 'production',
    unset: 'destroy',
  }
  app.use(session(conf))
}
