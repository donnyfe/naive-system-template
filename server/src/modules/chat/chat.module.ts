import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MessageModule } from '@/modules/chat-message/message.module'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'
import { ChatEntity } from './chat.entity'

@Module({
  imports: [ConfigModule, MessageModule, TypeOrmModule.forFeature([ChatEntity])],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
