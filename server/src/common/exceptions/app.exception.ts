export class AppException extends Error {
  constructor(
    public readonly message: string,
    public readonly code: number = 500,
    public readonly isOperational = true // 用于区分操作型错误和编程型错误
  ) {
    super(message)
    this.name = 'AppException'
    Error.captureStackTrace(this, this.constructor)
  }
}
