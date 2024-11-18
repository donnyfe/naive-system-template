import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { setEnvVariable } from '@baiducloud/qianfan'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
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
    this.apiKey = this.configService.get('qianfan.apikey')
    this.apiSecret = this.configService.get('qianfan.apiSecret')

    setEnvVariable('QIANFAN_ACCESS_KEY', this.apiKey)
    setEnvVariable('QIANFAN_SECRET_KEY', this.apiSecret)
  }

  async getToken() {
    const token = await this.redisService.get('QianfanToken')
    if (token) return token

    return new Promise(async (resolve, reject) => {
      try {
        const url = 'https://aip.baidubce.com/oauth/2.0/token'
        const params = {
          grant_type: 'client_credentials',
          client_id: this.apiKey,
          client_secret: this.apiSecret,
        }

        const res = await axios.request({
          method: 'POST',
          url,
          params,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
        const { access_token, expires_in } = res.data
        this.redisService.set('QianfanToken', access_token, expires_in)

        resolve(res.data)
      } catch (err) {
        reject(err)
      }
    })
  }

  async submit(chatDto: ChatDto) {
    // 取出对话记录
    const chat = await this.find(chatDto.chatId)
    // 取出上一条对话信息
    const prevMessage = chat.messages.filter((item) => item.messageId === chatDto.previousId)[0]
    const messages = [
      {
        role: prevMessage.sender,
        content: prevMessage.messageText,
      },
    ]

    const token = await this.getToken()
    const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/yi_34b_chat?access_token=${token}`
    const data = {
      messages,
      stream: true, // 是否以流式接口的形式返回数据，默认false
    }
    try {
      const res = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return res.data
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * 对话列表
   *
   * @returns
   */
  async findList(username: string) {
    try {
      return this.chatRepo.find({
        where: { delFlag: 0, username },
        order: { createTime: 'DESC' },
      })
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * 新增
   *
   * @param chat 信息
   * @return 结果
   */
  async create(chat: CreateChatDto, req: any) {
    const entity = new ChatEntity()
    entity.chatId = uuidv4()
    entity.chatName = chat.chatName
    entity.username = req.user.username
    entity.messages = null
    entity.createTime = new Date()
    entity.updateTime = new Date()
    return this.chatRepo.save(entity)
  }

  /**
   * 修改对话状态
   *
   * @param chat 对话信息
   * @return 结果
   */
  async remove(chatId: string) {
    const entity = await this.findOne(chatId)
    entity.delFlag = 1
    entity.updateTime = new Date()
    return this.chatRepo.save(entity)
  }

  /**
   * 清空用户对话列表
   *
   * @param username 用户
   * @return 结果
   */
  async clear(username: string) {
    const res = await this.dataSource
      .createQueryBuilder()
      .update(ChatEntity)
      .set({ delFlag: 1 })
      .where({ username })
      .execute()

    return res
  }

  /**
   * 修改对话
   *
   * @param chat 对话信息
   * @return 结果
   */
  async update(chat: UpdateChatDto) {
    const entity = await this.findOne(chat.chatId)
    entity.chatName = chat.chatName
    entity.updateTime = new Date()
    return this.chatRepo.save(entity)
  }

  /**
   * 获取实体
   * @param id
   * @returns
   */
  findOne(id: string): Promise<ChatEntity> {
    return this.chatRepo.findOneBy({ chatId: id })
  }

  async find(chatId: string): Promise<ChatEntity> {
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
  }
}
