export class UserNotRegisteredException extends Error {
  constructor(message?: string) {
    super(message || '用户未注册')
    this.name = 'UserNotRegisteredException'
  }
}

export class InvalidCredentialsException extends Error {
  constructor(message?: string) {
    super(message || '用户名或密码错误')
    this.name = 'InvalidCredentialsException'
  }
}
