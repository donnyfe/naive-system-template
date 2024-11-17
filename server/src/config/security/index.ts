import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { setupHelmet } from './helmet.config'
import { setupCors } from './cors.config'
import { setupRateLimit } from './rate-limit.config'
import { setupCsrf } from './csrf.config'
import { setupJwtSecurity } from './jwt.config'

export const setupSecurity = async (app: INestApplication) => {
  const configService = app.get(ConfigService)
  const isProduction = process.env.NODE_ENV === 'production'

  await setupHelmet(app, isProduction)
  await setupCors(app, configService)
  await setupRateLimit(app, isProduction)
  await setupCsrf(app)
  await setupJwtSecurity(app, configService)
}

export * from './helmet.config'
export * from './cors.config'
export * from './rate-limit.config'
export * from './csrf.config'
export * from './jwt.config'
