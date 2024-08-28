import { Body, Controller, Get, Param, Post, UseGuards, Request, Res } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Response } from 'express'
import { ChatService } from '@/modules/chat/chat.service'
import { MessageService } from '@/modules/chat-message/message.service'
import { ChatDto, CreateChatDto, UpdateChatDto } from './chat.dto'
import { responseSuccess } from '@/utils'
import { CreateMessageDto, UpdateMessageDto } from '../chat-message/message.dto'

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('token')
  async getAccessToken() {
    const token = await this.chatService.getToken()
    return responseSuccess(token, 'success')
  }

  /**
   * 新增对话
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createChat(@Body() chat: CreateChatDto, @Request() req: any) {
    const res = await this.chatService.create(chat, req)
    return responseSuccess(res)
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
    const res = await this.chatService.update(chat)
    return responseSuccess(res)
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
    const res = await this.chatService.remove(chatId)
    return responseSuccess(res)
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
    const res = await this.chatService.clear(username)
    return responseSuccess(res)
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
    const res = await this.chatService.find(chatId)
    return responseSuccess(res)
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
    const res = await this.chatService.findList(username)
    return responseSuccess(res)
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
    return responseSuccess(await this.messageService.create(message))
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
    await this.messageService.remove(messageId)
    return responseSuccess()
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
    await this.messageService.clear(chatId)
    return responseSuccess()
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
    const res = await this.messageService.update(message)
    return responseSuccess(res)
  }

  /**
   * 对话
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('submit')
  async submit(@Body() chatDto: ChatDto, @Res() res: Response) {
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Content-Type', 'text/event-stream;charset=utf-8')
    res.setHeader('X-Content-Type-Options', 'nosniff')

    try {
      const content = await this.chatService.submit(chatDto)
      const lines = content
        .toString()
        .split('\n')
        .filter((line) => line.trim() !== '')

      for (const line of lines) {
        const message = line.replace(/^data: /, '')
        const parsed = JSON.parse(message)
        res.write(`${parsed.result}`)
      }
      res.send()
    } catch (err) {
      console.log(err)
    }
  }
}
