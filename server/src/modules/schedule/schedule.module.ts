import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule'
import { ScheduleService } from './schedule.service'
import { ScheduleController } from './schedule.controller'
import { ScheduleEntity } from './schedule.entity'

@Module({
  imports: [
    NestScheduleModule.forRoot(),
    TypeOrmModule.forFeature([ScheduleEntity]),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
