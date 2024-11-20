import { Module } from '@nestjs/common'
import { CoreModule } from '@/core/core.module'
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
    /* 核心模块 */
    CoreModule,
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
export class AppModule {}
