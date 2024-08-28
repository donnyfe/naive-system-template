import { Body, Controller, Post, UseGuards, Request, Param } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags } from '@nestjs/swagger'
import { PromptService } from './prompt.service'
import { responseSuccess } from '@/utils'
import { CreatePromptDto, UpdatePromptDto } from './prompt.dto'

@ApiTags('prompt') // 添加 swagger 接口标签
@Controller('prompt')
export class PromptController {
  constructor(private readonly promptService: PromptService) {}

  /**
   * 添加
   *
   * @param prompt
   * @param req
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async create(@Body() prompt: CreatePromptDto, @Request() req: any) {
    const res = await this.promptService.create(prompt, req)
    return responseSuccess(res)
  }

  /**
   * 移除
   *
   * @param prompt
   * @param req
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('remove/:promptId')
  async remove(@Param('promptId') promptId: string) {
    await this.promptService.remove(promptId)

    return responseSuccess(null)
  }

  /**
   * 编辑
   *
   * @param prompt
   * @param req
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('update')
  async update(@Body() prompt: UpdatePromptDto) {
    const res = await this.promptService.update(prompt)
    return responseSuccess(res)
  }

  /**
   * 列表
   *
   * @param req
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('list')
  async findList(@Request() req: any) {
    const username = req.user.username
    const res = await this.promptService.findList(username)
    return responseSuccess(res)
  }
}
