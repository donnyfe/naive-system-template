import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedModule } from './shared/shared.module'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { ChatModule } from './modules/chat/chat.module'
import { PromptModule } from './modules/chat-prompt/prompt.module'
import configuration from './config/configuration'

@Module({
  imports: [
    /* 配置文件模块 */
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    SharedModule,
    AuthModule,
    UserModule,
    ChatModule,
    PromptModule,
  ],
})
export class AppModule {}
