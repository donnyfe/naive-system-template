import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import path from 'path'
import session from 'express-session'
import { mw as requestIpMw } from 'request-ip'
import { AppModule } from './app.module'

import { setupSecurity } from './config/security.config'
import { setupSwagger } from './config/swagger.config'
import { setupGlobal } from './config/global.config'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // 添加日志配置
    logger: ['error', 'warn', 'debug', 'log'],
    cors: true, // 开启跨域访问
  })

  // 获取配置服务
  const configService = app.get(ConfigService)

  // 设置信任代理
  app.set('trust proxy', 1)

  await setupSecurity(app)

  await setupSwagger(app)

  await setupGlobal(app)

  // 配置静态资源访问
  app.useStaticAssets(path.join(__dirname, '../uploads'), {
    prefix: '/uploads', //设置虚拟前缀路径
    maxAge: 1000 * 60, //设置缓存时间
  })

  // 设置session
  const sessionMiddleware = session({
    secret: configService.get('session.secret'), // 从配置中读取
    name: 'admin',
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1天
      sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: false,
  })
  app.use(sessionMiddleware)

  // 获取真实IP
  const ipMiddleware = requestIpMw({ attributeName: 'ip' })
  app.use(ipMiddleware)

  // 服务监听端口
  const port = configService.get('http.port')
  const host = configService.get('http.host')
  await app.listen(port)

  console.log(`🚀 启动成功: http://${host}:${port}`)
}
bootstrap()
