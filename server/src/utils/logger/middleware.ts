import { Request, Response, NextFunction } from 'express'
import logger from './index'

// 请求日志中间件
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()

  // 请求完成后记录日志
  res.on('finish', () => {
    const duration = Date.now() - startTime

    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('user-agent')
    })
  })

  next()
}

// 错误日志中间件
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Request error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip
  })

  next(err)
}
