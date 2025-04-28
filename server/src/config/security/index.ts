import { INestApplication } from '@nestjs/common'
import { setupHelmet } from './helmet.config'
import { setupCors } from './cors.config'
import { setupRateLimit } from './rate-limit.config'
import { setupJwtSecurity } from './jwt.config'

export const setupSecurity = async (app: INestApplication) => {
  const isProduction = process.env.NODE_ENV === 'production'

  // 配置安全头
  await setupHelmet(app, isProduction)
  // 配置跨域
  await setupCors(app, isProduction)
  // 配置限流
  await setupRateLimit(app, isProduction)
  // 配置JWT安全
  await setupJwtSecurity(app, isProduction)
}

export * from './helmet.config'
export * from './cors.config'
export * from './jwt.config'
export * from './rate-limit.config'
