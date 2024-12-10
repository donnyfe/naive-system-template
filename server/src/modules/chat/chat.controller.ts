import { Body, Controller, Get, Param, Post, UseGuards, Request, Res } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Response } from 'express'
import { ChatService } from '@/modules/chat/chat.service'
import { MessageService } from '@/modules/chat-message/message.service'
import { ChatDto, CreateChatDto, UpdateChatDto } from './chat.dto'
import { CreateMessageDto, UpdateMessageDto } from '../chat-message/message.dto'
import { Sse } from '@nestjs/common'

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('token')
  async getAccessToken() {
    return await this.chatService.getToken()
  }

  /**
   * 新增对话
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createChat(@Body() chat: CreateChatDto, @Request() req: any) {
    return await this.chatService.create(chat, req)
  }

  /**
   * 更新对话
   *
   * @param chat
   * @param req
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('update')
  async updateChat(@Body() chat: UpdateChatDto) {
    return await this.chatService.update(chat)
  }

  /**
   * 移除对话
   *
   * @param chatId
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('remove/:chatId')
  async removeChat(@Param('chatId') chatId: string) {
    return await this.chatService.remove(chatId)
  }

  /**
   * 清空对话列表
   *
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('clear')
  async clearChat(@Request() req: any) {
    const username = req.user.username
    return await this.chatService.clear(username)
  }

  /**
   * 根据id获取详细信息
   *
   * @param chatId
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Get(':chatId')
  async find(@Param('chatId') chatId: string) {
    return await this.chatService.find(chatId)
  }

  /**
   * 对话列表
   *
   * @param dto
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('list')
  async findList(@Request() req: any) {
    const username = req.user.username
    const result = await this.chatService.findList(username)
    return result
  }

  /**
   * 添加消息
   *
   * @param message
   * @param req
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('message/create')
  async createMessage(@Body() message: CreateMessageDto) {
    return await this.messageService.create(message)
  }

  /**
   * 移除消息
   *
   * @param chat
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('message/remove/:messageId')
  async removeMessage(@Param('messageId') messageId: string) {
    return await this.messageService.remove(messageId)
  }

  /**
   * 清空消息
   *
   * @param chatId
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('message/clear/:chatId')
  async clearMessage(@Param('chatId') chatId: string) {
    return await this.messageService.clear(chatId)
  }

  /**
   * 编辑
   *
   * @param message
   * @param req
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('message/update')
  async updateMessage(@Body() message: UpdateMessageDto) {
    return await this.messageService.update(message)
  }

  /**
   * 提交对话
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('submit')
  @Sse()
  async submit(@Body() chatDto: ChatDto, @Res() res: Response) {
    return await this.chatService.submit(chatDto, res)
  }
}
