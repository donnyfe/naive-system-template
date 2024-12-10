import { Body, Controller, Post, UseGuards, Request, Param } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags } from '@nestjs/swagger'
import { PromptService } from './prompt.service'
import { CreatePromptDto, UpdatePromptDto } from './prompt.dto'

@ApiTags('prompt') // 添加 swagger 接口标签
@Controller('prompt')
export class PromptController {
  constructor(private readonly promptService: PromptService) {}

  /**
   * 添加指令
   *
   * @param prompt
   * @param req
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async create(@Body() prompt: CreatePromptDto, @Request() req: any) {
    await this.promptService.create(prompt, req)
    return
  }

  /**
   * 移除指令
   *
   * @param prompt
   * @param req
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('remove/:promptId')
  async remove(@Param('promptId') promptId: string) {
    await this.promptService.remove(promptId)
    return null
  }

  /**
   * 编辑指令
   *
   * @param prompt
   * @param req
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('update')
  async update(@Body() prompt: UpdatePromptDto) {
    await this.promptService.update(prompt)
    return null
  }

  /**
   * 查询列表
   *
   * @param req
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('list')
  async findList(@Request() req: any) {
    const username = req.user.username
    return await this.promptService.findList(username)
  }
}
