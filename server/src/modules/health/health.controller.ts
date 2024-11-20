import { Controller, Get, Req } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { HealthCheck, HealthCheckService } from '@nestjs/terminus'
import { HealthService } from './health.service'
import { RedisService } from '@/core/redis/redis.service'
import { LoggerService } from '@/core/logger/logger.service'
import { AppException } from '@/common/exceptions/app.exception'

@ApiTags('系统健康检查')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private healthService: HealthService,
    private redisService: RedisService,
    private logger: LoggerService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: '健康检查' })
  async check() {
    return this.health.check([
      async () => this.healthService.checkDatabase(),
      async () => this.healthService.checkRedis(),
      async () => this.healthService.checkMemory(),
      async () => this.healthService.checkDiskSpace(),
    ])
  }

  @Get('health/session')
  async checkSessionHealth() {
    try {
      const testSession = await this.redisService.getClient().ping()
      return {
        status: 'ok',
        redis: testSession === 'PONG',
      }
    } catch (error) {
      this.logger.error('Session health check failed', error)
      throw new AppException('Session服务异常', 500)
    }
  }

  @Get('check-session')
  async checkSession(@Req() req: any) {
    return {
      sessionId: req.sessionID,
      hasSession: !!req.session,
      sessionData: req.session,
    }
  }
}
