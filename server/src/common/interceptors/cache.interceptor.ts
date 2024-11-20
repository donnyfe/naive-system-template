import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Response } from 'express'

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>()

    // 静态资源强缓存
    response.setHeader('Cache-Control', 'public, max-age=31536000') // 1年
    // 设置一个月过期时间
    response.setHeader('Expires', new Date(Date.now() + 2592000).toUTCString())

    // 协商缓存
    response.setHeader('Last-Modified', new Date().toUTCString())
    response.setHeader('ETag', this.generateETag())

    return next.handle()
  }

  private generateETag(): string {
    return Math.random().toString(36).substring(2)
  }
}
