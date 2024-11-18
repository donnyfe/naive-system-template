import { Injectable } from '@nestjs/common'
import { RedisService } from '@/core/redis/redis.service'

@Injectable()
export class CacheService {
  constructor(private redisService: RedisService) {}

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redisService.get(key)
    return data ? JSON.parse(data) : null
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.redisService.set(
      key,
      JSON.stringify(value),
      ttl,
    )
  }

  async del(key: string): Promise<void> {
    await this.redisService.del(key)
  }

  // 添加缓存装饰器
  static Cacheable(prefix: string, ttl?: number) {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor,
    ) {
      const originalMethod = descriptor.value
      descriptor.value = async function (...args: any[]) {
        const cacheService = this.cacheService as CacheService
        const key = `${prefix}:${JSON.stringify(args)}`

        const cached = await cacheService.get(key)
        if (cached) return cached

        const result = await originalMethod.apply(this, args)
        await cacheService.set(key, result, ttl)
        return result
      }
    }
  }
}

/**
 * 使用示例

1. 注入使用
// 注入CacheService
constructor(private cacheService: CacheService) {}

// 存储数据
await cacheService.set('key', data, 3600); // 缓存1小时

// 获取数据
const data = await cacheService.get<Type>('key');

// 删除数据
await cacheService.del('key');

2. 使用装饰器
class UserService {
  constructor(private cacheService: CacheService) {}

  @CacheService.Cacheable('users', 3600)
  async getUser(id: string) {
    // 方法执行结果会被自动缓存1小时
    // 缓存key为 users:["id"]
    return await this.userRepository.findOne(id);
  }
}
 */
