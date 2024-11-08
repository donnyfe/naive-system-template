import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { INestApplication } from '@nestjs/common'

export const setupSwagger = (app: INestApplication) => {
  // 配置全局前缀
  app.setGlobalPrefix('api')

  // 配置swagger
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Admin')
    .setDescription('接口文档')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, swaggerOptions)

  // 生产环境使用 nginx 可以将当前文档地址 屏蔽外部访问
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
}
