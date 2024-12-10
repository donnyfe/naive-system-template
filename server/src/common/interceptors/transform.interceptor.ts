import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable, map } from 'rxjs'

import { Request, Response } from 'express'

// 基础响应接口
export interface BaseResponse {
  success: boolean
  code: number
  message: string
  timestamp: number
}

// 成功响应
export interface SuccessResponse<T> extends BaseResponse {
  success: true
  data: T
}

// 错误响应
export interface ErrorResponse extends BaseResponse {
  success: false
  error: string
  errorCode?: string
  stack?: string
}

// 统一响应类型
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse


// 装饰器将类标记为可被NestJS框架注入的服务
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<ApiResponse<T>> {
  constructor(private reflector: Reflector) { }

  // 接收 ExecutionContext 和 CallHandler，并返回一个 Observable<Data>
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()

    // nestjs使用REST API风格，对于post请求默认返回201，所以需要手动处理成200
    if (request.method === 'POST' && response.statusCode === HttpStatus.CREATED) {
      response.status(HttpStatus.OK)
    }

    return next.handle().pipe(
      // 转换成功响应
      map((data): ApiResponse<T> => {
        return {
          success: true,
          code: HttpStatus.OK,
          data: data as T,
          message: 'Success',
          timestamp: Date.now(),
        }
      }),
    )
  }
}
