import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { LoggerService } from '@/modules/logger/logger.service'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const { method, url, body, headers } = req
    const ctx = context.getClass().name

    // 记录请求信息
    this.logger.info(`接收请求: ${method} ${url}`, ctx, {
      body,
      headers: {
        ...headers,
        authorization: headers.authorization ? '[REDACTED]' : undefined,
      },
    })

    const now = Date.now()
    return next.handle().pipe(
      tap({
        next: (data) => {
          // 记录响应信息
          this.logger.info(`发送请求: ${method} ${url}`, ctx, {
            duration: `${Date.now() - now}ms`,
            data,
          })
        },
        error: (error) => {
          // 记录错误信息
          this.logger.error(`请求失败: ${method} ${url}`, error.stack, ctx, {
            duration: `${Date.now() - now}ms`,
            error: error.message,
          })
        },
      }),
    )
  }
}
