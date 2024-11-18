import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { LoggerService } from '@/core/logger/logger.service'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    // 构建错误日志信息
    const errorMessage = exception instanceof HttpException
      ? exception.getResponse()
      : exception instanceof Error
        ? exception.message
        : 'Unknown error';

    // 获取错误堆栈
    const errorStack = exception instanceof Error
      ? exception.stack
      : undefined;

    // 记录详细错误日志
    this.logger.error(
      `${request.method} ${request.url}`,
      {
        message: errorMessage,
        stack: errorStack,
        timestamp: new Date().toISOString(),
        statusCode: status
      },
      'AllExceptionsFilter'
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorMessage,
    })
  }
}
