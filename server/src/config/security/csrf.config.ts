import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import csurf from 'csurf'

export const setupCsrf = (app: INestApplication) => {
  const configService = app.get(ConfigService)
  const csrfConfig = configService.get('security.csrf')

  app.use(
    csurf({
      cookie: csrfConfig.cookie,
      ignoreMethods: ['HEAD', 'OPTIONS'],
      value: (req) => req.headers['x-csrf-token'],
    })
  )

  app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
      res.status(403).json({
        statusCode: 403,
        message: 'Invalid CSRF token',
      })
    } else {
      next(err)
    }
  })
}
