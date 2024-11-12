import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable, map } from 'rxjs'
import { ReturnType } from '@/types'
import { Request, Response } from 'express'

export interface ResponseType<T> {
  success: boolean
  code: number
  message: string
  data: T
}

// 装饰器将类标记为可被NestJS框架注入的服务
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<ResponseType<T>> {
  constructor(private reflector: Reflector) { }

  // 接收 ExecutionContext 和 CallHandler，并返回一个 Observable<Data>
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<ResponseType<T>> {
    // nestjs使用REST API风格，对于post请求默认返回201，所以需要手动处理成200
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()

    if (request.method === 'POST' && response.statusCode === HttpStatus.CREATED) {
      response.status(HttpStatus.OK)
    }

    const returnType = this.reflector.get<ReturnType>('returnType', context.getHandler())

    // 调用处理链中的下一个处理程序，即继续执行后续的拦截器处理程序
    return next.handle().pipe(
      // 将原始的响应数据进行转换，确保最终响应数据的结构符合定义的Data接口。
      map((data) => {
        switch (returnType) {
          // 原始类型
          case 'primitive':
            return data
          // 默认返回包装过的响应结构
          default:
            return {
              success: true,
              code: 200,
              message: 'OK',
              ...data,
            }
        }
      }),
    )
  }
}
