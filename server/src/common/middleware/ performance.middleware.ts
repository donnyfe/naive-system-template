import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { performance } from 'perf_hooks'

@Injectable()
export class PerformanceMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = performance.now()

    res.on('finish', () => {
      const duration = performance.now() - start
      console.log(`${req.method} ${req.url} ${duration.toFixed(2)}ms`)
    })

    next()
  }
}
