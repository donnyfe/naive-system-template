import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Response } from 'express'
import { match } from 'path-to-regexp'
import * as crypto from 'crypto'
import { Reflector } from '@nestjs/core'

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  // 配置缓存策略
  private cacheConfig = {
    // 静态资源缓存1个月
    '/static/*path': {
      cacheControl: 'public, max-age=2592000',
      etag: true,
    },
    // API 接口使用协商缓存
    // '/api/*path': {
    //   cacheControl: 'no-cache',
    //   etag: true,
    //   exclude: ['/api/auth/captcha'], // 添加排除路径
    //   include: ['/api/users/*'], // 添加需要缓存的路径
    // },
  }
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse<Response>()

    const noCache = this.reflector.get('no-cache', context.getHandler())

    if (noCache) {
      const response = context.switchToHttp().getResponse()
      // 设置禁用缓存的headers
      response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      response.setHeader('Pragma', 'no-cache')
      response.setHeader('Expires', '0')
      // 添加额外的头以防止浏览器缓存
      response.setHeader('Surrogate-Control', 'no-store')
      return next.handle()
    }

    // 获取请求路径对应的缓存策略
    const cacheStrategy = this.getCacheStrategy(request.path)

    // 检查是否需要跳过缓存
    if (this.shouldSkipCache(request.path, cacheStrategy)) {
      return next.handle()
    }

    if (cacheStrategy) {
      // 设置缓存控制头
      response.setHeader('Cache-Control', cacheStrategy.cacheControl)

      if (cacheStrategy.etag) {
        // 生成基于内容的ETag
        response.setHeader('ETag', this.generateETag(response))
      }
    }

    return next.handle()
  }

  // 根据请求路径匹配缓存策略
  private getCacheStrategy(path: string) {
    // 遍历配置的路径模式
    for (const [pattern, strategy] of Object.entries(this.cacheConfig)) {
      try {
        // 处理catch-all segments
        const normalizedPattern = pattern.replace(/\[\.\.\.(.*?)\]/g, '*') // 将[...param]转换为*
        const matchFn = match(normalizedPattern)
        if (matchFn(path)) {
          return strategy
        }
      } catch (error) {
        console.warn(`Invalid path pattern: ${pattern}`, error)
        continue
      }
    }
    return null
  }

  // 基于响应内容生成ETag
  private generateETag(response: Response): string {
    const content = response.get('content')

    // 如果没有响应内容,返回弱ETag
    if (!content) {
      return `W/"${Date.now()}"`
    }

    // 计算内容的hash作为强ETag
    const hash = crypto.createHash('sha1').update(content).digest('base64').substring(0, 27)

    const contentLength = Buffer.byteLength(content)
    return `"${contentLength.toString(16)}-${hash}"`
  }

  // 判断是否需要跳过缓存
  private shouldSkipCache(path: string, strategy: any): boolean {
    if (!strategy) return true

    // 检查排除路径
    if (strategy.exclude) {
      const isExcluded = strategy.exclude.some((pattern: string) => {
        try {
          const normalizedPattern = pattern.replace(/\[\.\.\.(.*?)\]/g, '*')
          const matchFn = match(normalizedPattern)
          return matchFn(path) !== false
        } catch {
          return false
        }
      })
      if (isExcluded) return true
    }

    // 检查包含路径
    if (strategy.include) {
      const isIncluded = strategy.include.some((pattern: string) => {
        try {
          const normalizedPattern = pattern.replace(/\[\.\.\.(.*?)\]/g, '*')
          const matchFn = match(normalizedPattern)
          return matchFn(path) !== false
        } catch {
          return false
        }
      })
      return !isIncluded
    }

    return false
  }
}
