import { INestApplication } from '@nestjs/common'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
export const setupSecurity = (app: INestApplication) => {
  const isProduction = process.env.NODE_ENV === 'production'
  // 配置 helmet 安全头
  app.use(
    helmet({
      // 注意： 开发环境如果开启 nest static mode 需要将 crossOriginResourcePolicy 设置为 false 否则 静态资源 跨域不可访问
      // 在开发环境中禁用 COOP，或者配置为 unsafe-none
      // 跨域打开策略 - 生产环境更严格
      crossOriginOpenerPolicy: {
        policy: isProduction ? 'same-origin-allow-popups' : 'unsafe-none',
      },
      // 跨域资源访问策略
      crossOriginResourcePolicy: false,
      // 内容安全策略
      contentSecurityPolicy: isProduction
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'", "'unsafe-inline'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", 'data:', 'https:'],
            },
          }
        : false,
      // 启用 XSS 过滤
      xssFilter: true,
      // 禁止嗅探 MIME 类型
      noSniff: true,
    }),
  )

  // 限制应用访问频率
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟窗口
      max: isProduction ? 100 : 1000, //  限制每个IP 15分钟内最多100个请求, 生产环境更严格的限制
      message: '请求太频繁,请稍后再试',
      standardHeaders: true,
      legacyHeaders: false,
    }),
  )
}
