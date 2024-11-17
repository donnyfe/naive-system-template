import { INestApplication } from '@nestjs/common'
import helmet from 'helmet'

export const setupHelmet = async (app: INestApplication, isProduction: boolean) => {
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: {
        policy: isProduction ? 'same-origin' : 'unsafe-none',
      },
      crossOriginResourcePolicy: isProduction ? { policy: 'same-origin' } : false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
          sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin'],
          reportUri: '/csp-report',
        },
        reportOnly: !isProduction,
      },
      dnsPrefetchControl: true,
      frameguard: {
        action: 'deny',
      },
      hidePoweredBy: true,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      ieNoOpen: true,
      noSniff: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xssFilter: true,
    })
  )
}
