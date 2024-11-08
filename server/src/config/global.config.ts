import { INestApplication } from '@nestjs/common'
import { ValidationPipe } from '@nestjs/common'
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'

export const setupGlobal = (app: INestApplication) => {
  // 注册全局管道
  app.useGlobalPipes(
    // 全局参数校验管道,
    new ValidationPipe({
      transform: true,
      whitelist: true
    }),
  )
  // 注册全局过滤器
  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalFilters(new HttpExceptionFilter())
}
