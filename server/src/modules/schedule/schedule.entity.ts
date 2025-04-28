import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { ScheduleStatus, ScheduleType } from './types'

@Entity('schedule_tasks')
export class ScheduleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 100 })
  name: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({
    type: 'enum',
    enum: ScheduleType,
    default: ScheduleType.CRON,
  })
  type: ScheduleType

  @Column()
  expression: string // cron表达式或时间间隔

  @Column({ type: 'json' })
  taskData: Record<string, any>

  @Column({
    type: 'enum',
    enum: ScheduleStatus,
    default: ScheduleStatus.INACTIVE,
  })
  status: ScheduleStatus

  @Column({ type: 'datetime', nullable: true })
  lastRunTime: Date

  @Column({ type: 'datetime', nullable: true })
  nextRunTime: Date

  @Column({ default: 0 })
  retryCount: number

  @Column({ default: 3 })
  maxRetries: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
