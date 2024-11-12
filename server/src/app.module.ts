import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common'
import { PerformanceMiddleware } from '@/common/middleware/performance.middleware'
import { LoggerModule } from '@/modules/logger/logger.module'
import { LogType } from '@/modules/logger/logger.interface'
import { SharedModule } from './shared/shared.module'
import { HealthModule } from './modules/health/health.module'
import { ScheduleModule } from './modules/schedule/schedule.module'
import { AuthModule } from './modules/auth/auth.module'
import { UploadModule } from './modules/upload/upload.module'
import { RoleModule } from './modules/role/role.module'
import { UserModule } from './modules/user/user.module'
import { ChatModule } from './modules/chat/chat.module'
import { PromptModule } from './modules/chat-prompt/prompt.module'

@Module({
  imports: [
    /* 日志模块 */
    LoggerModule.forRoot({
      level: 'debug',
      type: LogType.SYSTEM,
      file: {
        enabled: true,
        path: 'logs/app-%DATE%.log',
        maxSize: '20m',
        maxFiles: '14d',
        zippedArchive: true,
      },
      console: {
        enabled: true,
        colorize: true,
      },
    }),

    /* 共享模块 */
    SharedModule,
    /* 健康检查模块 */
    HealthModule,
    /* 调度模块 */
    ScheduleModule,
    /* 上传模块 */
    UploadModule,
    /* 认证模块 */
    AuthModule,

    /* 用户模块 */
    UserModule,
    /* 角色模块 */
    RoleModule,
    /* 聊天模块 */
    ChatModule,
    /* 提示词模块 */
    PromptModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PerformanceMiddleware)
      .exclude() // 排除不需要性能监控的路由
      .forRoutes('*') // 应用到所有路由
  }
}
