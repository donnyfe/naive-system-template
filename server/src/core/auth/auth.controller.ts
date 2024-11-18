import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import * as svgCaptcha from 'svg-captcha'
import { responseFail } from '@/utils'
import { JwtGuard, LocalGuard } from '@/common/guards'
import { ChangePasswordDto, RegisterUserDto } from './auth.dto'
import { UserService } from '@/modules/user/user.service'
import { AuthService } from './auth.service'
import { LoggerService } from '@/core/logger/logger.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
    private logger: LoggerService,
  ) {}

  @Post('register')
  async register(@Body() user: RegisterUserDto) {
    return this.userService.register(user)
  }

  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Req() req: any, @Body() body) {

    if (req.session?.code?.toLocaleLowerCase() !== body.captcha?.toLocaleLowerCase()) {
      this.logger.error('auth.login', '验证码错误', req.session?.code)
      return responseFail(500, '验证码错误')
    }
    return this.authService.login(req.user, req.session?.code)
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  async logout(@Req() req: any) {
    return this.authService.logout(req.user)
  }

  @Get('refreshToken')
  @UseGuards(JwtGuard)
  async refreshToken(@Req() req: any) {
    return this.authService.generateToken(req.user)
  }

  // 生成验证码
  @Get('captcha')
  async createCaptcha(@Req() req, @Res() res) {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 40,
      width: 80,
      height: 40,
      background: '#fff',
      color: true,
    })
    req.session.code = captcha.text || ''
    res.type('image/svg+xml')
    res.send(captcha.data)
  }

  @Post('password')
  @UseGuards(JwtGuard)
  async changePassword(@Req() req: any, @Body() body: ChangePasswordDto) {
    const ret = await this.authService.validateUser(req.user.username, body.oldPassword)
    if (!ret) {
      return responseFail(500, '密码验证失败')
    }
    // 修改密码
    await this.userService.resetPassword(req.user.id, body.newPassword)
    // 修改密码后退出登录
    await this.authService.logout(req.user)
    return true
  }
}
