import { Controller, Post, Put, Delete, Body, Param } from '@nestjs/common'
import { ScheduleService } from './schedule.service'
import { CreateScheduleDto, UpdateScheduleDto } from './schedule.dto'

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.scheduleService.update(id, updateScheduleDto)
  }

  @Delete(':id')
  stop(@Param('id') id: string) {
    return this.scheduleService.stopTask(id)
  }
}
