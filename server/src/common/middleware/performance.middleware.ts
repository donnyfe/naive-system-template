import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { performance } from 'perf_hooks'
import { LoggerService } from '@/core/logger/logger.service'

const getCircularReplacer = () => {
  const seen = new WeakSet()
  return (key: string, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return
      }
      seen.add(value)
    }
    return value
  }
}

@Injectable()
export class PerformanceMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = performance.now()

    res.on('finish', () => {
      const duration = performance.now() - start
      const info = {
        method: req.method,
        url: req.url,
        duration: `${duration.toFixed(2)}ms`,
        statusCode: res.statusCode,
      }

      this.logger.log('Performance', `${JSON.stringify(info, getCircularReplacer())}`)
    })

    next()
  }
}
