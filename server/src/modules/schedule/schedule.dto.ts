import { ApiProperty } from '@nestjs/swagger'
import { ScheduleStatus, ScheduleType } from './types'
import {
  IsString,
  IsEnum,
  IsObject,
  IsOptional,
  IsNumber,
  Min,
  Max,
  ValidateIf,
} from 'class-validator'

export class CreateScheduleDto {
  @IsString()
  name: string

  @IsString()
  @IsOptional()
  description?: string

  @IsEnum(ScheduleType)
  type: ScheduleType

  @IsString()
  expression: string

  @IsObject()
  taskData: Record<string, any>

  @IsEnum(ScheduleStatus)
  @IsOptional()
  status?: ScheduleStatus

  @IsNumber()
  @IsOptional()
  maxRetries?: number
}

export class UpdateScheduleDto {
  @ApiProperty({ description: '定时任务名称', required: false })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ description: '定时任务描述', required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ description: '定时任务类型', enum: ScheduleType, required: false })
  @IsOptional()
  @IsEnum(ScheduleType)
  type?: ScheduleType

  @ApiProperty({ description: 'cron表达式，当type为cron时必填', required: false })
  @ValidateIf((o) => o.type === ScheduleType.CRON)
  @IsString()
  cron?: string

  @ApiProperty({ description: '间隔时间(秒)，当type为interval时必填', required: false })
  @ValidateIf((o) => o.type === ScheduleType.INTERVAL)
  @IsNumber()
  @Min(1)
  @Max(2147483647)
  interval?: number

  @ApiProperty({ description: '延迟时间(秒)，当type为timeout时必填', required: false })
  @ValidateIf((o) => o.type === ScheduleType.TIMEOUT)
  @IsNumber()
  @Min(1)
  @Max(2147483647)
  timeout?: number

  @ApiProperty({ description: '要执行的任务函数', required: false })
  @IsOptional()
  @IsString()
  job?: string

  @ApiProperty({ description: '任务参数', required: false })
  @IsOptional()
  data?: Record<string, any>
}
