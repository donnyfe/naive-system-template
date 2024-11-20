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

    // 确保session存在
    if (!req.session) {
      this.logger.error('captcha.create', 'Session未初始化')
      return responseFail(500, '系统错误:会话未初始化')
    }

    // 显式检查验证码文本
    if (!captcha.text) {
      this.logger.error('captcha.create', '验证码生成失败')
      return responseFail(500, '验证码生成失败')
    }

    req.session.code = captcha.text

    res.type('image/svg+xml')
    res.send(captcha.data)
  }

  @Post('register')
  async register(@Body() user: RegisterUserDto) {
    return this.userService.register(user)
  }

  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Req() req: any, @Body() body) {
    this.logger.debug(
      '尝试登录',
      JSON.stringify({
        sessionCode: req.session?.code,
        inputCaptcha: body.captcha,
        hasSession: !!req.session,
      }),
    )

    if (!req.session) {
      this.logger.error('auth.login', 'Session未初始化')
      return responseFail(500, '系统错误:会话未初始化')
    }

    if (!req.session.code) {
      this.logger.error('auth.login', '验证码未找到')
      return responseFail(500, '验证码已失效,请重新获取')
    }

    if (req.session?.code?.toLocaleLowerCase() !== body.captcha?.toLocaleLowerCase()) {
      this.logger.error('auth.login', '验证码错误', req.session?.code)
      return responseFail(500, '验证码错误')
    }

    console.log('req.session', JSON.stringify(req.session), req.session?.code)
    return this.authService.login(req.user, req.session?.code)
  }

  @Get('refreshToken')
  @UseGuards(JwtGuard)
  async refreshToken(@Req() req: any) {
    return this.authService.generateToken(req.user)
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  async logout(@Req() req: any) {
    return this.authService.logout(req.user)
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
