import compression from 'compression'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class CompressionMiddleware implements NestMiddleware {
  // 默认压缩配置
  private readonly options = {
    // 只压缩大于1KB的响应
    threshold: 1024,
    // 压缩级别 (0-9)
    level: 6,
    // 根据Content-Type判断是否需要压缩
    filter: (req: Request, res: Response) => {
      if (req.headers['x-no-compression']) {
        return false
      }
      // 默认压缩text/*, application/* 类型响应
      return compression.filter(req, res)
    },
  }

  constructor(options?: compression.CompressionOptions) {
    // 合并自定义配置
    Object.assign(this.options, options)
  }

  use(req: Request, res: Response, next: NextFunction) {
    compression(this.options)(req, res, next)
  }
}
