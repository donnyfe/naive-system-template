import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { PromptEntity } from './prompt.entity'
import { CreatePromptDto, UpdatePromptDto } from './prompt.dto'

@Injectable()
export class PromptService {
  constructor(
    @InjectRepository(PromptEntity)
    private promptRepo: Repository<PromptEntity>,
    private dataSource: DataSource,
  ) {}

  /**
   * 新增指令
   *
   * @param prompt 信息
   * @return 结果
   */
  async create(prompt: CreatePromptDto, req: any) {
    try {
      const newPrompt = {
        promptId: uuidv4(),
        username: req.user.username,
        ...prompt,
      }
      return await this.promptRepo.save(newPrompt)
    } catch (error) {
      throw new Error(`Failed to create prompt: ${error.message}`)
    }
  }

  /**
   * 软删除，修改指令状态
   *
   * @param prompt 对话信息
   * @return 结果
   */
  async remove(promptId: string) {
    try {
      const entity = await this.findOne(promptId)
      entity.delFlag = 1
      return await this.promptRepo.save(entity)
    } catch (error) {
      throw new Error(`Failed to remove prompt: ${error.message}`)
    }
  }

  /**
   * 修改指令
   *
   * @param prompt 指令信息
   * @return 结果
   */
  async update(prompt: UpdatePromptDto) {
    try {
      const entity = await this.findOne(prompt.promptId)
      entity.title = prompt.title
      entity.content = prompt.content
      return await this.promptRepo.save(entity)
    } catch (error) {
      throw new Error(`Failed to update prompt: ${error.message}`)
    }
  }

  /**
   * 获取实体
   * @param id
   * @returns
   */
  async findOne(id: string): Promise<PromptEntity> {
    try {
      return await this.promptRepo.findOneBy({ promptId: id })
    } catch (error) {
      throw new Error(`Failed to find prompt: ${error.message}`)
    }
  }

  async findByPromptId(promptId: string): Promise<PromptEntity> {
    try {
      return await this.promptRepo.findOne({
        where: { promptId, delFlag: 0 },
      })
    } catch (error) {
      throw new Error(`Failed to find prompt: ${error.message}`)
    }
  }

  /**
   * 列表
   *
   * @returns
   */
  async findList(username: string) {
    try {
      return await this.promptRepo.find({
        where: { delFlag: 0, username },
        order: { createTime: 'DESC' },
      })
    } catch (error) {
      throw new Error(`Failed to find prompt list: ${error.message}`)
    }
  }
}
