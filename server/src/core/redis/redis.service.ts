import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common'
import { RedisClientType } from 'redis'
import { LoggerService } from '@/core/logger/logger.service'

@Injectable()
export class RedisService implements OnApplicationShutdown {
  public redisClient: RedisClientType
  constructor(
    @Inject('REDIS_CLIENT') private readonly client: RedisClientType,
    private logger: LoggerService,
  ) {
    this.redisClient = client
  }

  getClient() {
    return this.redisClient
  }

  async onApplicationShutdown() {
    await this.client.quit()
    this.logger.log('Redis connection closed')
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key)
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value)
    } else {
      await this.client.set(key, value)
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key)
  }

  async hashGet(key: string) {
    return await this.client.hGetAll(key)
  }

  async hashSet(key: string, obj: Record<string, any>, ttl?: number) {
    for (const name in obj) {
      await this.client.hSet(key, name, obj[name])
    }

    if (ttl) {
      await this.client.expire(key, ttl)
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
        this.client.ping(),
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
