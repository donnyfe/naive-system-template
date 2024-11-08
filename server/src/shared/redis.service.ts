import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType

  async get(key: string) {
    return await this.redisClient.get(key)
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value)

    if (ttl) {
      await this.redisClient.expire(key, ttl)
    }
  }

  async del(key: string) {
    await this.redisClient.del(key)
    return true
  }

  async hashGet(key: string) {
    return await this.redisClient.hGetAll(key)
  }

  async hashSet(key: string, obj: Record<string, any>, ttl?: number) {
    for (const name in obj) {
      await this.redisClient.hSet(key, name, obj[name])
    }

    if (ttl) {
      await this.redisClient.expire(key, ttl)
    }
  }

  /**
   * 检查Redis连接是否可用
   * @param timeout 超时时间(毫秒)
   * @returns 如果连接正常返回true,否则返回false
   */
  async ping(timeout = 1000): Promise<boolean> {
    try {
      // 设置超时时间
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      // 发送ping命令
      const result = await Promise.race([
        this.redisClient.ping(),
        new Promise((_, reject) => {
          controller.signal.addEventListener('abort', () => reject(new Error('Redis ping timeout')))
        }),
      ])

      clearTimeout(timeoutId)
      return result === 'PONG'
    } catch (err) {
      return false
    }
  }
}
