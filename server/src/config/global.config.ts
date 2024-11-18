import { Reflector } from '@nestjs/core'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { RequestLoggingInterceptor } from '@/common/interceptors/logger.interceptor'
import { LoggerService } from '@/core/logger/logger.service'


export const setupGlobal = (app: INestApplication) => {
  // 注册全局拦截器
  app.useGlobalInterceptors(
    // 数据转换拦截器
    new TransformInterceptor(app.get(Reflector)),
    // 请求日志拦截器
    new RequestLoggingInterceptor(app.get(LoggerService))
  )

  // 注册全局管道
  app.useGlobalPipes(
    // 全局参数校验管道,
    new ValidationPipe({
      whitelist: true,
      transform: true
    }),
  )
  // 注册全局过滤器
  app.useGlobalFilters(
    // 全局异常过滤器
    new GlobalExceptionFilter(),
    // http异常过滤器
    new HttpExceptionFilter()
  )
}
