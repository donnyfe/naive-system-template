import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common'
import { Request, Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { LoggerService } from '@/core/logger/logger.service'
import { v4 as uuid } from 'uuid'
import { QueryFailedError } from 'typeorm'
import { BusinessException } from '@/common/exceptions/business.exception'
import { ValidationException } from '@/common/exceptions/validation.exception'
// 错误详情
export interface ErrorDetails {
  status: number
  code: number
  message: string
  details?: any
  stack?: string
}

// 统一的错误响应接口
export interface ErrorResponse {
  code: number
  message: string
  timestamp: string
  type: string
  requestId: string
  path: string
  method: string
  details?: any
  stack?: string
}

// 错误码枚举
export enum ErrorCode {
  // 内部错误码
  INTERNAL_ERROR = 500,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  VALIDATION_ERROR = 422,
  RATE_LIMIT = 429,
  // 数据库错误码
  DATABASE_ERROR = 5000,
  DUPLICATE_ENTRY = 5001,
  FOREIGN_KEY_VIOLATION = 5002,
  // 业务错误码
  BUSINESS_ERROR = 6000,
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
    console.log('-------------exception-----------> ')
    console.log(exception)
    console.log('--------------------------------')
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
      requestId: uuid(), // request.headers['x-request-id']
      type: this.getErrorType(exception),

      // 仅在开发环境返回详细错误信息
      ...(this.isDevelopment() && {
        details: errorDetails.details,
        stack: errorDetails.stack,
      }),
    }

    response.status(errorDetails.status).json(errorResponse)
  }

  private getErrorDetails(exception: unknown) {

    if (exception instanceof UnauthorizedException) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        code: ErrorCode.UNAUTHORIZED,
        message: '未经授权的访问',
      }
    }

    if (exception instanceof QueryFailedError) {
      return this.handleQueryFailedError(exception)
    }

    if (exception instanceof ValidationException) {
      return this.handleValidationError(exception)
    }

    if (exception instanceof BusinessException) {
      return {
        status: HttpStatus.BAD_REQUEST,
        code: exception.code,
        message: exception.message,
        // details: this.isDevelopment() ? exception.details : undefined,
      }
    }

    if (exception instanceof Error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        code: ErrorCode.INTERNAL_ERROR,
        message: exception.message,
        stack: exception.stack,
        details: this.isDevelopment() ? exception : undefined,
      }
    }

    // 处理其他类型异常...
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: ErrorCode.INTERNAL_ERROR,
      message: '服务器内部错误',
      details: this.isDevelopment() ? exception : undefined,
    }
  }

  /**
   * 处理数据库错误
   * @param error 数据库错误
   * @returns 错误详情
   */
  private handleQueryFailedError(error: QueryFailedError): ErrorDetails {
    // 错误码映射
    const ErrorCodes = {
      '23505': {
        // 唯一约束违反
        code: ErrorCode.DUPLICATE_ENTRY,
        message: '数据已存在',
      },
      '23503': {
        // 外键约束违反
        code: ErrorCode.FOREIGN_KEY_VIOLATION,
        message: '关联数据不存在',
      },
      // 可添加其他数据库错误码映射
    }

    const errorCode = (error as any).code
    const defaultError = {
      code: ErrorCode.DATABASE_ERROR,
      message: '数据库操作失败',
    }

    return {
      status: HttpStatus.BAD_REQUEST,
      ...(ErrorCodes[errorCode] || defaultError),
      details: this.isDevelopment() ? error : undefined,
    }
  }

  /**
   * 处理验证错误
   * @param error 验证错误
   * @returns 错误详情
   */
  private handleValidationError(error: ValidationException): ErrorDetails {
    // 从 errors 数组中获取第一个错误信息
    const firstError = error.errors[0]

    return {
      status: HttpStatus.BAD_REQUEST,
      code: ErrorCode.VALIDATION_ERROR,
      message: firstError?.message || '验证失败',
      details: this.isDevelopment()
        ? {
            errors: error.errors, // 返回完整的错误数组
          }
        : undefined,
    }
  }

  private logError(request: Request, errorDetails: any, exception: unknown) {
    const logData = {
      userAgent: request.headers['user-agent'],
      requestId: request.headers['x-request-id'],
      ip: request.ip,
      // userId: request.user?.id,
      url: request.url,
      method: request.method,
      headers: request.headers,
      query: request.query,
      // 脱敏处理
      body: this.sanitizeData(request.body),
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

  /**
   * 数据脱敏
   * @param data 数据
   * @returns 脱敏后的数据
   */
  private sanitizeData(data: any) {
    // 实现数据脱敏逻辑
    // TODO: 实现数据脱敏逻辑 例如：隐藏敏感信息、截断长字符串等
    return data
  }

  // private mapHttpStatusToErrorCode(httpStatus: number): number {
  //   const statusCodeMap = {
  //     [HttpStatus.BAD_REQUEST]: ErrorCode.BAD_REQUEST,
  //     [HttpStatus.UNAUTHORIZED]: ErrorCode.UNAUTHORIZED,
  //     [HttpStatus.FORBIDDEN]: ErrorCode.FORBIDDEN,
  //     [HttpStatus.NOT_FOUND]: ErrorCode.NOT_FOUND,
  //     [HttpStatus.UNPROCESSABLE_ENTITY]: ErrorCode.VALIDATION_ERROR,
  //     [HttpStatus.TOO_MANY_REQUESTS]: ErrorCode.RATE_LIMIT,
  //   }
  //   return statusCodeMap[httpStatus] || ErrorCode.INTERNAL_ERROR
  // }

  /**
   * 获取错误类型
   * @param exception 异常
   * @returns 错误类型
   */
  private getErrorType(exception: unknown): string {
    if (exception instanceof HttpException) {
      return 'HTTP'
    } else if (exception instanceof QueryFailedError) {
      return 'DATABASE'
    } else if (exception instanceof ValidationException) {
      return 'VALIDATION'
    } else if (exception instanceof BusinessException) {
      return 'BUSINESS'
    }
    return 'INTERNAL'
  }

  /**
   * 是否是开发环境
   * @returns 是否是开发环境
   */
  private isDevelopment(): boolean {
    return this.configService.get('NODE_ENV') === 'development'
  }
}
