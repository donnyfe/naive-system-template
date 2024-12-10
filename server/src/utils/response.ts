export class Result<T> {
  code: number
  message: string
  data: T | null
}

export function responseSuccess<T>(message?: string, data?: T): Result<T> {
  const result: Result<T> = {
    code: 200,
    message: message || 'success',
    data,
  }
  return result
}

export function responseFail<T>(code?: number, message?: string, data?: T): Result<T> {
  const result: Result<T> = {
    code: code || 500,
    message: message || 'fail',
    data,
  }
  return result
}
