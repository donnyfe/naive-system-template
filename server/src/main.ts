import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import path from 'path'
import RedisStore from 'connect-redis'
import { RedisService } from '@/core/redis/redis.service'
import { mw as requestIpMw } from 'request-ip'
import { AppModule } from './app.module'

import { setupSession } from './config/session.config'
import { setupSecurity } from './config/security'
import { setupSwagger } from './config/swagger.config'
import { setupGlobal } from './config/global.config'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
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
    prefix: '/uploads', // 设置虚拟前缀路径
    maxAge: '1y', // 强缓存一年
    etag: true, // 开启ETag
    lastModified: true, // 开启Last-Modified
  })

  const redisService = app.get(RedisService)

  // 设置Redis Store
  const redisStore = new RedisStore({
    client: redisService.getClient(),
    prefix: configService.get('redis.prefix'),
    ttl: configService.get('redis.ttl'), // 默认1天
  })

  await setupSession(app, redisStore)

  // 获取真实IP
  const ipMiddleware = requestIpMw({ attributeName: 'ip' })
  app.use(ipMiddleware)

  // 服务监听端口
  const host = configService.get('http.host')
  const port = configService.get('http.port')
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
