import { NestExpressApplication } from '@nestjs/platform-express'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import session from 'express-session'
import { mw as requestIpMw } from 'request-ip'
import { ValidationPipe } from '@nestjs/common'
import { ExceptionsFilter } from './common/filters/exceptions-filter'
import { HttpExceptionsFilter } from './common/filters/http-exceptions-filter'
import path from 'path'

async function bootstrap() {
  // 创建nest实例
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true, // 开启跨域访问
  })
  const configService = app.get(ConfigService)

  // 配置静态资源访问
  app.useStaticAssets(path.join(__dirname, '../uploads'), {
    prefix: '/uploads', //设置虚拟前缀路径
    maxAge: 1000 * 60, //设置缓存时间
  })

  // 配置插件
  app.use(
    // 限制应用访问频率
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 1000, // 限制15分钟内最多只能访问1000次
    }),

    // 设置session
    session({
      secret: 'admin',
      name: 'admin.session',
      rolling: true,
      cookie: { maxAge: null },
      resave: false,
      saveUninitialized: true,
    }),

    // web安全
    // 注意： 开发环境如果开启 nest static module 需要将 crossOriginResourcePolicy 设置为 false 否则 静态资源 跨域不可访问
    helmet({
      crossOriginOpenerPolicy: {
        policy: 'same-origin-allow-popups',
      },
      // 跨域资源访问策略
      crossOriginResourcePolicy: false,
    }),

    // 获取真实IP
    requestIpMw({ attributeName: 'ip' }),
  )

  // 注册全局管道
  app.useGlobalPipes(
    // 全局参数校验管道,
    new ValidationPipe({ transform: true, whitelist: true }),
  )
  // 注册全局过滤器
  app.useGlobalFilters(new ExceptionsFilter())
  app.useGlobalFilters(new HttpExceptionsFilter())

  // 配置swagger
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Admin')
    .setDescription('接口文档')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, swaggerOptions)

  // 项目依赖当前文档功能，最好不要改变当前地址
  // 生产环境使用 nginx 可以将当前文档地址 屏蔽外部访问
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })

  // 服务监听端口
  const port = configService.get('http.port')
  const host = configService.get('http.host')
  await app.listen(port)

  console.log(`🚀 启动成功: http://${host}:${port}`)
}
bootstrap()
