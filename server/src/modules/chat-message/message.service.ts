import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { MessageEntity } from './message.entity'
import { CreateMessageDto, UpdateMessageDto } from './message.dto'

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private messagegRepo: Repository<MessageEntity>,
  ) {}

  /**
   * 新增
   *
   * @param menu 信息
   * @return 结果
   */
  async create(message: CreateMessageDto) {
    const entity = new MessageEntity()
    entity.messageId = uuidv4()
    entity.previousId = message.previousId
    entity.chatId = message.chatId
    entity.messageText = message.messageText
    entity.sender = message.sender
    entity.completed = message.completed
    entity.createTime = new Date()

    return this.messagegRepo.save(entity)
  }

  /**
   * 修改消息状态
   *
   * @param message 消息信息
   * @return 结果
   */
  async remove(messageId: string) {
    const entity = await this.findOne(messageId)
    entity.delFlag = 1
    return this.messagegRepo.save(entity)
  }

  /**
   * 清空消息
   *
   * @param chatId chatId
   * @return 结果
   */
  async clear(chatId: string) {
    return await this.messagegRepo.update({ chatId: chatId }, { delFlag: 1 })
  }

  /**
   * 修改消息
   *
   * @param message 消息信息
   * @return 结果
   */
  async update(message: UpdateMessageDto) {
    const entity = await this.findOne(message.messageId)
    entity.messageText = message.messageText
    entity.completed = message.completed
    return this.messagegRepo.save(entity)
  }

  /**
   * 获取实体
   * @param id
   * @returns
   */
  findOne(id: string): Promise<MessageEntity> {
    return this.messagegRepo.findOneBy({ messageId: id })
  }

  findByMessageId(messageId: string): Promise<MessageEntity> {
    return this.messagegRepo.findOne({
      where: { messageId, delFlag: 0 },
    })
  }

  /**
   * 消息列表
   *
   * @returns
   */
  async findListBychatId(chatId: string) {
    const messages = await this.messagegRepo.find({
      where: { delFlag: 0, chatId },
      order: { createTime: 'ASC' },
    })

    // 按聊天问题记录排序
    const res = messages.reduce((acc, item) => {
      if (item.sender === 'user') {
        acc.push(item)

        const aiMessages = messages.filter((msg) => msg.previousId === item.messageId)

        if (aiMessages?.length > 0) {
          acc.push(...aiMessages)
        }
      }
      return acc
    }, [] as MessageEntity[])

    return res
  }
}
