import { Body, Controller, Get, Post, Param, Query, Delete, Patch, UseGuards, Request } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto, UpdatePasswordDto, UpdateUserDto, GetUserListDto } from './user.dto'
import { ErrorInfo } from '@/common/constants/result-code'
import { JwtGuard } from '@/common/guards'
import { responseFail } from '@/utils'

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body() user: CreateUserDto) {
    return this.userService.create(user)
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Request() req: any) {
    if (req.user.userId === id) {
      return responseFail(500, '不能删除自己！')
    }
    return this.userService.remove(id)
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() user: UpdateUserDto) {
    return this.userService.update(id, user)
  }

  @Get('list')
  findAll(@Query() queryDto: GetUserListDto) {
    return this.userService.findAll(queryDto)
  }
  /**
   * @desc 获取当前登录用户的详情信息
   */
  @Get('detail')
  getUserInfo(@Request() req: any) {
    const currentUser = req.user
    return this.userService.findUserInfo(currentUser.id)
  }

  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.userService.findByUsername(username)
  }

  /** 管理员重置密码 */
  @Patch('password/reset/:userId')
  resetPassword(@Param('userId') userId: number, @Body() dto: UpdatePasswordDto) {
    return this.userService.resetPassword(userId, dto.password)
  }
}
