import { Catch, HttpException, ExceptionFilter, ArgumentsHost } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    // const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()

    let msg = exceptionResponse?.message
    msg = Array.isArray(msg) && msg.length > 0 ? msg.join('; ') : ''

    response.status(200).json({
      success: status === 200,
      code: exception.code || status,
      data: null,
      message: msg || exception.message || 'Service Error',
    })
  }
}
