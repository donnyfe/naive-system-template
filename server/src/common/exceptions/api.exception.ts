import { HttpException, HttpStatus } from '@nestjs/common'
import { ErrInfo } from '@/common/constants/result-code'

/**
 * API异常类
 * 用于规范化处理API错误响应
 */
export class ApiException extends HttpException {
  /**
   * 业务错误码
   */
  protected code: number

  /**
   * 错误详细信息
   */
  protected details?: Record<string, any>

  /**
   * 错误发生时间
   */
  protected timestamp: number

  constructor(
    err: ErrInfo,
    message?: string,
    status?: HttpStatus,
    details?: Record<string, any>
  ) {
    // 构造基础错误信息
    const errMessage = message ?? err.message ?? String(err.code)
    super(errMessage, status ?? HttpStatus.BAD_REQUEST)

    // 扩展错误信息
    this.code = err.code
    this.details = details
    this.timestamp = Date.now()
  }

  /**
   * 获取规范化的错误响应
   */
  getResponse(): Record<string, any> {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      status: this.getStatus(),
      path: this.getPath(), // 需要在异常过滤器中注入
    }
  }

  protected getPath(): string {
    // 从请求上下文中获取路径
    return 'unknown'
  }
}

export { ErrInfo }
