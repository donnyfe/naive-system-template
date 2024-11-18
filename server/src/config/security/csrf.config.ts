import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import csurf from 'csurf'

/**
 * 配置CSRF保护
 */
export const setupCsrf = (app: INestApplication) => {
  const configService = app.get(ConfigService)
  const securityConfig = configService.get('security')

  app.use(
    csurf({
      // 设置cookie
      cookie: securityConfig.cookie,
      // 跳过这些HTTP方法的CSRF检查
      ignoreMethods: ['HEAD', 'OPTIONS', 'GET'],
      // 从自定义请求头提取token
      value: (req) => req.headers['x-csrf-token'],
    }),
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
