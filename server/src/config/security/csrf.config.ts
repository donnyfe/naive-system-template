import { INestApplication } from '@nestjs/common'
import csurf from 'csurf'

export const setupCsrf = async (app: INestApplication) => {
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      },
      ignoreMethods: ['HEAD', 'OPTIONS'],
      value: (req) => {
        return req.headers['x-csrf-token']
      },
    })
  )

  // CSRF错误处理
  app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
      res.status(403).json({
        statusCode: 403,
        message: 'CSRF token 验证失败',
      })
    } else {
      next(err)
    }
  })
}
