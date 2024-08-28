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
   * 新增
   *
   * @param prompt 信息
   * @return 结果
   */
  async create(prompt: CreatePromptDto, req: any) {
    const newPrompt = {
      promptId: uuidv4(),
      username: req.user.username,
      ...prompt,
    }
    return this.promptRepo.save(newPrompt)
  }

  /**
   * 修改指令状态
   *
   * @param prompt 对话信息
   * @return 结果
   */
  async remove(promptId: string) {
    const entity = await this.findOne(promptId)
    entity.delFlag = 1
    return this.promptRepo.save(entity)
  }

  /**
   * 修改指令
   *
   * @param prompt 指令信息
   * @return 结果
   */
  async update(prompt: UpdatePromptDto) {
    const entity = await this.findOne(prompt.promptId)
    entity.title = prompt.title
    entity.content = prompt.content

    return this.promptRepo.save(entity)
  }

  /**
   * 获取实体
   * @param id
   * @returns
   */
  findOne(id: string): Promise<PromptEntity> {
    return this.promptRepo.findOneBy({ promptId: id })
  }

  findByPromptId(promptId: string): Promise<PromptEntity> {
    return this.promptRepo.findOne({
      where: { promptId, delFlag: 0 },
    })
  }

  /**
   * 列表
   *
   * @returns
   */
  async findList(username: string) {
    return this.promptRepo.find({
      where: { delFlag: 0, username },
      order: { createTime: 'DESC' },
    })
  }
}
