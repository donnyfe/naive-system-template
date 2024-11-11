import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HealthModule } from './modules/health/health.module'
import { ScheduleModule } from './modules/schedule/schedule.module'
import { SharedModule } from './shared/shared.module'
import { LoggerModule } from './modules/logger/logger.module'
import { AuthModule } from './modules/auth/auth.module'
import { RoleModule } from './modules/role/role.module'
import { UserModule } from './modules/user/user.module'
import { ChatModule } from './modules/chat/chat.module'
import { PromptModule } from './modules/chat-prompt/prompt.module'
import { UploadModule } from './modules/upload/upload.module'
import AppConfig from './config/app.config'
import { LogType } from './modules/logger/logger.interface'

@Module({
  imports: [
    /* 配置模块 */
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig],
    }),
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
    /* 健康检查模块 */
    HealthModule,
    /* 调度模块 */
    ScheduleModule,
    /* 共享模块 */
    SharedModule,
    /* 上传模块 */
    UploadModule,
    /* 认证模块 */
    AuthModule,
    /* 角色模块 */
    RoleModule,
    /* 用户模块 */
    UserModule,
    /* 聊天模块 */
    ChatModule,
    /* 提示词模块 */
    PromptModule,
  ],
})
export class AppModule {}
