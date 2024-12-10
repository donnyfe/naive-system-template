import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { Request, Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { LoggerService } from '@/core/logger/logger.service'
// 统一的错误响应接口
export interface ErrorResponse {
  code: number
  message: string
  timestamp: string
  path: string
  method: string
  details?: any
  stack?: string
}

// 错误码枚举
export enum ErrorCode {
  INTERNAL_ERROR = 500,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  VALIDATION_ERROR = 422,
  RATE_LIMIT = 429,
}

// 错误消息映射
const ERROR_MESSAGES = {
  [ErrorCode.INTERNAL_ERROR]: '服务器内部错误',
  [ErrorCode.BAD_REQUEST]: '错误的请求参数',
  [ErrorCode.UNAUTHORIZED]: '未经授权的访问',
  [ErrorCode.FORBIDDEN]: '禁止访问',
  [ErrorCode.NOT_FOUND]: '资源未找到',
  [ErrorCode.VALIDATION_ERROR]: '数据验证失败',
  [ErrorCode.RATE_LIMIT]: '请求过于频繁',
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    // 获取错误详情
    const errorDetails = this.getErrorDetails(exception)

    // 记录错误日志
    this.logError(request, errorDetails, exception)

    // 构建错误响应
    const errorResponse: ErrorResponse = {
      code: errorDetails.code,
      message: errorDetails.message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      // 仅在开发环境返回详细错误信息
      ...(this.isDevelopment() && {
        details: errorDetails.details,
        stack: errorDetails.stack,
      }),
    }

    response.status(errorDetails.status).json(errorResponse)
  }

  private getErrorDetails(exception: unknown) {
    let status: number = 200
    let message: string = 'OK'
    let code: number = 200
    let details: any
    let stack: string | undefined

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const response = exception.getResponse()
      code = this.mapHttpStatusToErrorCode(status)
      message = typeof response === 'string' ? response : ERROR_MESSAGES[code] // response['message']
      details = response

    } else if (exception instanceof Error) {
      if (exception.name === 'ValidationError') {
        status = HttpStatus.BAD_REQUEST
        code = ErrorCode.BAD_REQUEST
      } else if (exception.name === 'UnauthorizedError') {
        status = HttpStatus.UNAUTHORIZED
        code = ErrorCode.UNAUTHORIZED
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR
        code = ErrorCode.INTERNAL_ERROR
      }
      message = exception.message
      stack = exception.stack
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR
      message = ERROR_MESSAGES[ErrorCode.INTERNAL_ERROR]
      code = ErrorCode.INTERNAL_ERROR
    }

    return { status, message, code, details, stack }
  }

  private logError(request: Request, errorDetails: any, exception: unknown) {
    const logData = {
      url: request.url,
      method: request.method,
      headers: request.headers,
      query: request.query,
      body: request.body,
      errorCode: errorDetails.code,
      errorMessage: errorDetails.message,
      timestamp: new Date().toISOString(),
      stack: exception instanceof Error ? exception.stack : undefined,
    }

    if (errorDetails.code >= 500) {
      this.logger.error(
        `Server error: ${request.method} ${request.url}`,
        null,
        'GlobalExceptionFilter',
        logData,
      )
    } else {
      this.logger.warn(
        `Client error: ${request.method} ${request.url}`,
        'GlobalExceptionFilter',
        logData,
      )
    }
  }

  private mapHttpStatusToErrorCode(httpStatus: number): number {
    const statusCodeMap = {
      [HttpStatus.BAD_REQUEST]: ErrorCode.BAD_REQUEST,
      [HttpStatus.UNAUTHORIZED]: ErrorCode.UNAUTHORIZED,
      [HttpStatus.FORBIDDEN]: ErrorCode.FORBIDDEN,
      [HttpStatus.NOT_FOUND]: ErrorCode.NOT_FOUND,
      [HttpStatus.UNPROCESSABLE_ENTITY]: ErrorCode.VALIDATION_ERROR,
      [HttpStatus.TOO_MANY_REQUESTS]: ErrorCode.RATE_LIMIT,
    }
    return statusCodeMap[httpStatus] || ErrorCode.INTERNAL_ERROR
  }

  private isDevelopment(): boolean {
    return this.configService.get('NODE_ENV') === 'development'
  }
}
