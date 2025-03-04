import { HttpException, HttpStatus } from '@nestjs/common'

export class BusinessException extends HttpException {
  code: number
  data: any
  message: string

  constructor(message: string, code: number = HttpStatus.BAD_REQUEST, data?: any) {
    super(
      {
        message,
        code,
        data,
      },
      code,
    )
    this.name = 'BusinessException'
    this.code = code
    this.data = data
    this.message = message
  }
}

// 认证相关异常
export class UnauthorizedException extends BusinessException {
  constructor(message = '未登录或登录已过期') {
    super(message, HttpStatus.UNAUTHORIZED) // 401
  }
}

export class ForbiddenException extends BusinessException {
  constructor(message = '没有操作权限') {
    super(message, HttpStatus.FORBIDDEN) // 403
  }
}

// 业务相关异常
export class QueryFailedException extends BusinessException {
  constructor(message = '数据库查询失败') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR) // 500
  }
}

export class UserNotFoundException extends BusinessException {
  constructor(message = '用户未注册') {
    super(message, HttpStatus.NOT_FOUND) // 404
  }
}

export class InvalidCredentialsException extends BusinessException {
  constructor(message = '用户名或密码错误') {
    super(message, HttpStatus.UNAUTHORIZED)
  }
}
