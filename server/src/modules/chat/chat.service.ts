import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { Response } from 'express'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { setEnvVariable } from '@baiducloud/qianfan'
import { RedisService } from '@/core/redis/redis.service'
import { ChatEntity } from './chat.entity'
import { MessageEntity } from '../chat-message/message.entity'
import { ChatDto, CreateChatDto, UpdateChatDto } from './chat.dto'


@Injectable()
export class ChatService {
  apiKey: string
  apiSecret: string

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private dataSource: DataSource,
    @InjectRepository(ChatEntity) private chatRepo: Repository<ChatEntity>,
  ) {
    this.apiKey = this.configService.get('baidu.qianfanApiKey')
    this.apiSecret = this.configService.get('baidu.qianfanApiSecret')

    setEnvVariable('QIANFAN_ACCESS_KEY', this.apiKey)
    setEnvVariable('QIANFAN_SECRET_KEY', this.apiSecret)
  }

  /**
   * 获取百度千帆API token
   * @link https://cloud.baidu.com/doc/WENXINWORKSHOP/s/Dlkm79mnx
   * @returns
   */
  async getToken(): Promise<string> {
    const token = await this.redisService.get('QianfanToken')
    if (token) {
      return token
    }

    return new Promise(async (resolve, reject) => {
      try {
        const url = 'https://aip.baidubce.com/oauth/2.0/token'

        const res = await axios.request({
          method: 'POST',
          url,
          params: {
            grant_type: 'client_credentials',
            client_id: this.apiKey,
            client_secret: this.apiSecret,
          },
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
        const { access_token, expires_in } = res.data
        await this.redisService.set('QianfanToken', access_token, expires_in)
        return access_token
      } catch (err) {
        reject(err)
        throw err
      }
    })
  }

  /**
   * 提交对话
   *
   * @param chatDto
   * @param response
   */
  async submit(chatDto: ChatDto, response: Response) {
    let messages = []
    try {
      // 取出对话记录
      const chat = await this.find(chatDto.chatId)

      // 单轮对话取最后一条用户发出的消息
      // const prevMessage = chat.messages.filter((item) => item.messageId === chatDto.previousId)[0]
      // messages = [
      //   {
      //     role: prevMessage.sender,
      //     content: prevMessage.messageText,
      //   },
      // ]

      // 多轮对话取所有消息，需要确保最后一条为用户发送的消息
      messages = chat.messages.map((item) => ({
        role: item.sender,
        content: item.messageText,
      }))

      if (messages.length > 0 && messages[messages.length - 1].role !== 'user') {
        messages.pop()
      }
    } catch (error) {
      throw error
    }

    // 获取token
    const token = await this.getToken()
    const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/yi_34b_chat?access_token=${token}`
    try {
      /**
       * 提交对话
       * @link https://cloud.baidu.com/doc/WENXINWORKSHOP/s/vlpteyv3c
       */
      const res = await axios.request({
        method: 'POST',
        url,
        data: {
          messages,
          stream: true,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'stream',
      })

      // 处理流式响应
      const decoder = new TextDecoder()
      for await (const chunk of res.data) {
        try {
          const text = decoder.decode(chunk)
          const lines = text.split('\n').filter((line) => line.trim())

          for (const line of lines) {
            const message = line.replace(/^data: /, '')
            if (message) {
              const parsed = JSON.parse(message)
              response.write(`data: ${JSON.stringify(parsed)}\n\n`)
            }
          }
        } catch (error) {
          console.error('Error processing chunk:', error)
          response.write(`data: ${JSON.stringify({ error: 'Parse Error' })}\n\n`)
        }
      }
    } catch (error) {
      console.error('Stream error:', error)
      response.write(`data: ${JSON.stringify({ error: 'Stream Error' })}\n\n`)
    } finally {
      response.end()
    }
  }

  /**
   * 对话列表
   *
   * @returns
   */
  async findList(username: string) {
    try {
      const list = await this.chatRepo.find({
        where: { delFlag: 0, username },
        order: { createTime: 'DESC' },
      })

      return list
    } catch (error) {
      throw new Error(`Failed to find chat list: ${error.message}`)
    }
  }

  /**
   * 新增
   *
   * @param chat 信息
   * @return 结果
   */
  async create(chat: CreateChatDto, req: any) {
    try {
      const entity = new ChatEntity()
      entity.chatId = uuidv4()
      entity.chatName = chat.chatName
      entity.username = req.user.username
      entity.messages = null
      entity.createTime = new Date()
      entity.updateTime = new Date()

      return await this.chatRepo.save(entity)
    } catch (error) {
      throw new Error(`Failed to create chat: ${error.message}`)
    }
  }

  /**
   * 删除对话 (采用软删除，修改对话状态)
   *
   * @param chat 对话信息
   * @return 结果
   */
  async remove(chatId: string) {
    try {
      const entity = await this.findOne(chatId)
      entity.delFlag = 1
      entity.updateTime = new Date()

      await this.chatRepo.save(entity)

      return null
    } catch (error) {
      throw new Error(`Failed to remove chat: ${error.message}`)
    }
  }

  /**
   * 清空用户对话列表
   *
   * @param username 用户
   * @return 结果
   */
  async clear(username: string) {
    try {
      await this.dataSource
        .createQueryBuilder()
        .update(ChatEntity)
        .set({ delFlag: 1 })
        .where({ username })
        .execute()

      return null
    } catch (error) {
      throw new Error(`Failed to clear chat: ${error.message}`)
    }
  }

  /**
   * 修改对话
   *
   * @param chat 对话信息
   * @return 结果
   */
  async update(chat: UpdateChatDto) {
    try {
      const entity = await this.findOne(chat.chatId)
      entity.chatName = chat.chatName
      entity.updateTime = new Date()
      return await this.chatRepo.save(entity)
    } catch (error) {
      throw new Error(`Failed to update chat: ${error.message}`)
    }
  }

  /**
   * 获取实体
   * @param id
   * @returns
   */
  async findOne(id: string): Promise<ChatEntity> {
    try {
      return await this.chatRepo.findOneBy({ chatId: id })
    } catch (error) {
      throw new Error(`Failed to find chat: ${error.message}`)
    }
  }

  /**
   * 获取对话
   *
   * @param chatId
   * @returns
   */
  async find(chatId: string): Promise<ChatEntity> {
    try {
      const chat = await this.chatRepo
        .createQueryBuilder('Chat')
        .leftJoinAndSelect('Chat.messages', 'MessageEntity')
        .where({ chatId, delFlag: 0 })
        .orderBy({ 'MessageEntity.createTime': 'ASC' })
        .getOne()

      chat.messages = chat.messages.reduce((acc, item) => {
        if (item.sender === 'user') {
          acc.push(item)

          const aiMessages = chat.messages.filter((msg) => msg.previousId === item.messageId)

          if (aiMessages?.length > 0) {
            acc.push(...aiMessages)
          }
        }
        return acc
      }, [] as MessageEntity[])

      return chat
    } catch (error) {
      throw new Error(`Failed to find chat: ${error.message}`)
    }
  }
}
