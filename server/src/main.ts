import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import path from 'path'
import session from 'express-session'
import RedisStore from 'connect-redis'
import { RedisService } from '@/core/redis/redis.service'
import { mw as requestIpMw } from 'request-ip'
import { AppModule } from './app.module'

import { setupSecurity } from './config/security'
import { createSessionConfig } from './config/session.config'
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

  const redisService = app.get(RedisService)

  // 设置Redis Store
  const redisStore = new RedisStore({
    client: redisService['redisClient'], // 使用已有的Redis客户端
    prefix: configService.get('redis.session.prefix') || 'sess:', // session键前缀
    ttl: configService.get('redis.session.ttl') || 86400, // 默认1天
  })

  // 设置session
  const sessionConfig = createSessionConfig(configService, redisService)
  const sessionMiddleware = session(sessionConfig)
  app.use(sessionMiddleware)

  // 获取真实IP
  const ipMiddleware = requestIpMw({ attributeName: 'ip' })
  app.use(ipMiddleware)

  // 服务监听端口
  const port = configService.get('http.port')
  const host = configService.get('http.host')
  await app.listen(port)

  console.log(`🚀 启动成功: http://${host}:${port}`)

  // 添加进程退出处理, 优雅退出
  process.on('SIGINT', async () => {
    // 确保应用在退出时正确释放端口
    await app.close()
    process.exit(0)
  })
}
bootstrap()
