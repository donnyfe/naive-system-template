import { INestApplication } from '@nestjs/common'
import helmet from 'helmet'

/**
 * 配置安全头
 */
export const setupHelmet = async (app: INestApplication, isProduction: boolean) => {
  app.use(
    helmet({
      // 允许页面加载任何来源的资源
      crossOriginEmbedderPolicy: false,
      // 控制跨源打开器策略
      crossOriginOpenerPolicy: {
        // 生产环境: same-origin - 资源只能被同源页面加载
        // 开发环境: unsafe-none - 允许跨源通信,方便调试
        policy: isProduction ? 'same-origin' : 'unsafe-none',
      },
      crossOriginResourcePolicy: isProduction ? { policy: 'same-origin' } : false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"], // 默认源
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // 允许脚本源
          styleSrc: ["'self'", "'unsafe-inline'"], // 允许样式源
          imgSrc: ["'self'", 'data:', 'https:'], // 允许图片源
          connectSrc: ["'self'"], // 允许连接源
          fontSrc: ["'self'"], // 允许字体源
          objectSrc: ["'none'"], // 禁止对象源
          mediaSrc: ["'self'"], // 允许媒体源
          frameSrc: ["'none'"], // 禁止iframe嵌入
          sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin'], // 允许沙盒
          reportUri: '/csp-report', // 报告URI
        },
        // 开发环境只报告不阻止
        reportOnly: !isProduction,
      },
      // 允许DNS预取
      dnsPrefetchControl: true,
      // 禁止网页被嵌入iframe,防止点击劫持
      frameguard: {
        action: 'deny',
      },
      // 隐藏X-Powered-By头,避免暴露技术栈
      hidePoweredBy: true,
      //  HTTP严格传输安全，强制浏览器使用HTTPS
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        // 预加载HSTS列表
        preload: true,
      },
      // 禁止IE打开下载的文件
      ieNoOpen: true,
      // 禁止浏览器猜测资源类型
      noSniff: true,
      // 严格的引用策略,跨域时只发送源
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      // 启用浏览器XSS防护
      xssFilter: true,
    }),
  )
}
