import { Module } from '@nestjs/common'
import { EmailController } from './email.controller'
import { EmailService } from './email.service'
import { RedisModule } from '@/core/redis/redis.module'
import { RedisService } from '@/core/redis/redis.service'

@Module({
  imports: [RedisModule],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
