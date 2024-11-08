import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { HealthCheck, HealthCheckService } from '@nestjs/terminus'
import { HealthService } from './health.service'

@ApiTags('系统健康检查')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private healthService: HealthService,
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
}
