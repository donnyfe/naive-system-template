interface ErrInfo {
  message?: string
  code: number
}

export class Result<T> {
  code: number
  message: string
  data: T | null
}

export function responseSuccess<T>(data?: T, message?: string): Result<T> {
  const result: Result<T> = {
    code: 200,
    message: message || 'success',
    data: data || null,
  }
  return result
}

export function responseFail<T>(code?: number, message?: string, data?: any): Result<T> {
  const resCode = code || 500
  const resMessage = message || 'fail'

  const result: Result<T> = {
    code: resCode,
    message: resMessage,
    data,
  }
  return result
}
