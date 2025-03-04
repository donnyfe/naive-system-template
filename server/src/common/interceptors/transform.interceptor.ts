import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable, map } from 'rxjs'
import { Request, Response } from 'express'
import { BaseResponse } from 'src/utils/response'

// 扩展 Result 接口添加额外字段
export interface ApiResult<T> extends BaseResponse<T> {
  success: boolean
  timestamp: string // 统一使用ISO字符串格式
}

// 成功响应
export interface SuccessResponse<T> extends ApiResult<T> {
  data: T
}

// 错误响应接口
export interface ErrorResponse extends ApiResult<null> {
  error: string // 错误信息
  errorCode?: string // 错误码
  details?: any // 错误详情
  stack?: string // 错误堆栈(仅开发环境)
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
        // 处理已经格式化的响应
        if (data && data.code) {
          return {
            ...data,
            success: data.code === HttpStatus.OK,
            timestamp: new Date().toISOString(),
          }
        }
        // 处理原始数据响应
        return {
          code: HttpStatus.OK,
          message: 'success',
          data: data as T,
          success: true,
          timestamp: new Date().toISOString(),
        }
      }),
    )
  }
}
