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

export function responseFail<T>(errInfo?: ErrInfo, message?: string, code?: number, data?: any): Result<T> {
  const resCode = errInfo?.code || code || 500
  const resMessage = errInfo?.message || message || 'fail'

  const result: Result<T> = {
    code: resCode,
    message: resMessage,
    data,
  }
  return result
}
