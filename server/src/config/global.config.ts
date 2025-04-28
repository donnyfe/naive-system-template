import { Reflector } from '@nestjs/core'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LoggerService } from '@/core/logger/logger.service'
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter'
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
// import { LoggerInterceptor } from '@/common/interceptors/logger.interceptor'
import { HttpCacheInterceptor } from '@/common/interceptors/cache.interceptor'
import { TimeoutInterceptor } from '@/common/interceptors/timeout.interceptor'

export const setupGlobal = (app: INestApplication) => {
  // 注册全局拦截器
  app.useGlobalInterceptors(
    // 数据转换拦截器
    new TransformInterceptor(app.get(Reflector)),
    // 静态资源缓存拦截器
    new HttpCacheInterceptor(app.get(Reflector)),
    // 请求日志拦截器
    // new LoggerInterceptor(app.get(LoggerService)),
    // 请求超时拦截器
    new TimeoutInterceptor(),
  )

  // 注册全局管道
  app.useGlobalPipes(
    // 全局参数校验管道,
    new ValidationPipe({
      transform: true, // 自动类型转换
      whitelist: true, // 过滤掉未定义的属性
      forbidNonWhitelisted: true, // 抛出未定义属性的错误
      disableErrorMessages: process.env.NODE_ENV === 'production', // 生产环境禁用详细错误
    }),
  )

  // 注册全局过滤器
  app.useGlobalFilters(
    // 全局异常过滤器
    new GlobalExceptionFilter(app.get(ConfigService), app.get(LoggerService)),
  )
}
