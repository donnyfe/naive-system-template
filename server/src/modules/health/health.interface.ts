export interface HealthCheckResult {
  status: 'ok' | 'error'
  info: {
    [key: string]: {
      status: string
      details?: any
    }
  }
  error: {
    [key: string]: {
      status: string
      message: string
    }
  }
  details: {
    [key: string]: any
  }
}
