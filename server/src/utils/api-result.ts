interface ResponseInfo {
  message?: string
  code: number
}

export class ApiResult {
  code?: number
  message?: string
  data?: any

  constructor(response: ApiResult) {
    const { code, message, data } = response
    this.code = code
    this.message = message || 'ok'
    this.data = data || null
  }

  static ok(data?: any, message?: string): ApiResult {
    const result = {
      code: 200,
      message: message || 'ok',
      data,
    }
    return new ApiResult(result)
  }

  static fail(response: ResponseInfo, message?: string, data?: any): ApiResult {
    const result = {
      code: response.code || 500,
      message: message ? message : response.message || 'fail',
      data,
    }
    return new ApiResult(result)
  }
}
