import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SchedulerRegistry, Cron } from '@nestjs/schedule'
import { ScheduleEntity } from './schedule.entity'
import { CreateScheduleDto, UpdateScheduleDto } from './schedule.dto'
import { ScheduleStatus, ScheduleType } from './types'
import { LoggerService } from '@/core/logger/logger.service'

@Injectable()
export class ScheduleService {
  private readonly runningTasks = new Map<string, any>()

  constructor(
    @InjectRepository(ScheduleEntity)
    private scheduleRepository: Repository<ScheduleEntity>,
    private schedulerRegistry: SchedulerRegistry,
    private logger: LoggerService,
  ) {
    this.initializeScheduledTasks()
  }

  async initializeScheduledTasks() {
    const tasks = await this.scheduleRepository.find({
      where: { status: ScheduleStatus.ACTIVE },
    })

    for (const task of tasks) {
      await this.scheduleTask(task)
    }
  }

  async scheduleTask(task: ScheduleEntity) {
    try {
      const jobFunction = async () => {
        task.status = ScheduleStatus.RUNNING
        task.lastRunTime = new Date()
        await this.scheduleRepository.save(task)

        try {
          // 执行具体任务逻辑
          await this.executeTask(task)

          task.status = ScheduleStatus.ACTIVE
          task.retryCount = 0
        } catch (error) {
          this.logger.error(`Task ${task.name} failed: ${error.message}`, 'ScheduleService')
          task.status = ScheduleStatus.ERROR
          task.retryCount++

          if (task.retryCount < task.maxRetries) {
            // 重试逻辑
            setTimeout(() => this.scheduleTask(task), 5000)
          }
        }

        await this.scheduleRepository.save(task)
      }

      switch (task.type) {
        case ScheduleType.CRON:
          this.schedulerRegistry.addCronJob(
            task.id,
            new (Cron as any)(task.expression, jobFunction),
          )
          break

        case ScheduleType.INTERVAL:
          const interval = setInterval(jobFunction, parseInt(task.expression))
          this.schedulerRegistry.addInterval(task.id, interval)
          break

        case ScheduleType.TIMEOUT:
          const timeout = setTimeout(jobFunction, parseInt(task.expression))
          this.schedulerRegistry.addTimeout(task.id, timeout)
          break
      }

      this.runningTasks.set(task.id, jobFunction)
    } catch (error) {
      this.logger.error(`Failed to schedule task ${task.name}: ${error.message}`)
      throw error
    }
  }

  private async executeTask(task: ScheduleEntity) {
    // 这里实现具体的任务执行逻辑
    // 可以根据 task.taskData 中的配置来执行不同类型的任务
    this.logger.log(`Executing task: ${task.name}`)

    // 示例：支持 HTTP 请求任务
    if (task.taskData.type === 'http') {
      // 执行 HTTP 请求
    }

    // 示例：支持数据库操作任务
    if (task.taskData.type === 'database') {
      // 执行数据库操作
    }
  }

  async create(createScheduleDto: CreateScheduleDto) {
    const task = this.scheduleRepository.create(createScheduleDto)
    await this.scheduleRepository.save(task)

    if (task.status === ScheduleStatus.ACTIVE) {
      await this.scheduleTask(task)
    }

    return task
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    const task = await this.scheduleRepository.findOne({ where: { id } })
    if (!task) {
      throw new Error('Task not found')
    }

    // 如果任务正在运行，先停止它
    if (this.runningTasks.has(id)) {
      this.stopTask(id)
    }

    // 更新任务
    Object.assign(task, updateScheduleDto)
    await this.scheduleRepository.save(task)

    // 如果更新后状态为活动，重新调度任务
    if (task.status === ScheduleStatus.ACTIVE) {
      await this.scheduleTask(task)
    }

    return task
  }

  async stopTask(id: string) {
    try {
      const task = await this.scheduleRepository.findOne({ where: { id } })
      if (!task) {
        throw new Error('Task not found')
      }

      switch (task.type) {
        case ScheduleType.CRON:
          this.schedulerRegistry.deleteCronJob(id)
          break
        case ScheduleType.INTERVAL:
          this.schedulerRegistry.deleteInterval(id)
          break
        case ScheduleType.TIMEOUT:
          this.schedulerRegistry.deleteTimeout(id)
          break
      }

      this.runningTasks.delete(id)

      task.status = ScheduleStatus.INACTIVE
      await this.scheduleRepository.save(task)

      return true
    } catch (error) {
      this.logger.error(`Failed to stop task ${id}: ${error.message}`)
      throw error
    }
  }
}
