import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { HttpModule } from '@nestjs/axios'
import { HealthController } from './health.controller'
import { HealthService } from './health.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '@/modules/user/user.entity'
import { RedisModule } from '@/core/redis/redis.module'

@Module({
  imports: [TerminusModule, HttpModule, RedisModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
