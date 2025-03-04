// 基础响应接口
export interface BaseResponse<T> {
  code: number // 业务状态码
  message: string // 响应消息
  data: T | null
}

export function responseSuccess<T>(message?: string, data?: T): BaseResponse<T> {
  const res: BaseResponse<T> = {
    code: 200,
    message: message || 'success',
    data,
  }
  return res
}

export function responseFail<T>(code?: number, message?: string, data?: T): BaseResponse<T> {
  const res: BaseResponse<T> = {
    code: code || 500,
    message: message || 'fail',
    data,
  }
  return res
}
