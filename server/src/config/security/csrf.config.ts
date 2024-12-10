import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import csurf from 'csurf'

/**
 * 配置CSRF保护
 */
export const setupCsrf = (app: INestApplication, isProduction: boolean) => {
  const configService = app.get(ConfigService)
  const securityConfig = configService.get('security')

  app.use(
    csurf({
      cookie: {
        domain: securityConfig.cookie.domain,
        /**
         * sameSite: 控制CSRF保护的cookie的SameSite属性
         * 1. 'strict' - 最严格,只允许同站点请求携带cookie
         * 2. 'lax' - 相对宽松,允许部分跨站GET请求携带cookie
         * 3. 'none' - 最宽松,允许所有跨站请求携带cookie(需要配合secure=true使用)
         */
        // sameSite: isProduction ? 'lax' : 'none',
        // 本地开发环境使用 'lax' 而不是 'none'
        sameSite: 'lax',
        // 本地开发环境下不启用 secure
        secure: isProduction,
        // 始终启用 httpOnly
        httpOnly: true,
        key: securityConfig.csrf.key,
        secret: securityConfig.csrf.secret,
        path: '/', // 显式设置 cookie path
      },
      // 跳过这些HTTP方法的CSRF检查
      ignoreMethods: ['HEAD', 'OPTIONS', 'GET'],
      // 从专门的CSRF header获取token
      value: (req) => {
        // 从标准位置按优先级获取token
        return (
          req.headers['csrf-token'] || // 从专用header获取
          req.headers['xsrf-token'] ||
          req.headers['x-csrf-token'] ||
          req.headers['x-xsrf-token'] ||
          req.body._csrf || // 从请求体获取
          req.query._csrf || // 从查询参数获取
          // 安全地从Authorization获取
          (req.headers['authorization'] && req.headers['authorization'].split(' ')[1])
        )
      },
    }),
  )

  app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
      res.status(403).json({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Invalid or missing CSRF token',
        code: 'CSRF_ERROR',
      })
    } else if (err.code === 'EINVALIDCSRFTOKEN') {
      res.status(403).json({
        statusCode: 403,
        error: 'Forbidden',
        message: 'CSRF token expired',
        code: 'CSRF_EXPIRED',
      })
    } else {
      next(err)
    }
  })
}
