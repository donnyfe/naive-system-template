import { Injectable } from '@nestjs/common'
import { HealthCheckResult, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RedisService } from '@/shared/redis.service'
import { UserEntity } from '@/modules/user/user.entity'
import { getDiskInfoSync } from 'node-disk-info'

@Injectable()
export class HealthService extends HealthIndicator {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super()
  }

  // 检查数据库连接
  async checkDatabase(): Promise<HealthIndicatorResult> {
    try {
      await this.userRepository.query('SELECT 1')
      return this.getStatus('database', true)
    } catch (error) {
      return this.getStatus('database', false, { message: error.message })
    }
  }

  // 检查Redis连接
  async checkRedis(): Promise<HealthIndicatorResult> {
    try {
      await this.redisService.ping()
      return this.getStatus('redis', true)
    } catch (error) {
      return this.getStatus('redis', false, { message: error.message })
    }
  }

  // 检查内存使用情况
  async checkMemory(): Promise<HealthIndicatorResult> {
    const usedMemory = process.memoryUsage()
    const memoryThreshold = 1024 * 1024 * 1024 // 1GB

    const isHealthy = usedMemory.heapUsed < memoryThreshold
    return this.getStatus('memory', isHealthy, {
      heapUsed: `${Math.round(usedMemory.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(usedMemory.heapTotal / 1024 / 1024)}MB`,
    })
  }

  private getDiskInfo(): { free: number; size: number } {
    try {
      const disks = getDiskInfoSync()

      // 累加所有磁盘的总容量和可用空间
      const totalInfo = disks.reduce(
        (acc, disk) => {
          // blocks 是以字节为单位的总容量
          // available 是以字节为单位的可用空间
          return {
            size: acc.size + disk.blocks,
            free: acc.free + disk.available,
          }
        },
        { size: 0, free: 0 },
      )

      return totalInfo
    } catch (error) {
      // 如果获取磁盘信息失败，返回默认值
      return {
        size: 0,
        free: 0,
      }
    }
  }
  // 检查磁盘空间
  async checkDiskSpace(): Promise<HealthIndicatorResult> {
    try {
      const { free, size } = await this.getDiskInfo()
      const threshold = 0.1 // 10%的剩余空间阈值
      const isHealthy = free / size > threshold

      return this.getStatus('disk', isHealthy, {
        free: `${Math.round(free / 1024 / 1024 / 1024)}GB`,
        total: `${Math.round(size / 1024 / 1024 / 1024)}GB`,
        threshold: `${threshold * 100}%`,
      })
    } catch (error) {
      return this.getStatus('disk', false, { message: error.message })
    }
  }
}
