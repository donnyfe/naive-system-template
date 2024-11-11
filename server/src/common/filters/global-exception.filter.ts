import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { AppException } from '../exceptions/app.exception'
import { Logger } from '@nestjs/common'
import { Request, Response } from 'express'

export interface ErrorResponse {
  code: number
  message: string
  timestamp: string
  path: string
  method: string
}


@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionsFilter')

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    // 获取状态码和错误信息
    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = '服务器内部错误'
    let code = 500

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      message = exception.message
    } else if (exception instanceof AppException) {
      status = exception.code
      message = exception.message
      code = exception.code
    }

    // 记录错误日志
    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : 'No stack trace',
      'ExceptionFilter',
    )

    // 返回统一的错误响应格式
    const errorResponse: ErrorResponse = {
      code,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    }

    response.status(status).json(errorResponse)
  }
}
