import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtGuard, LocalGuard } from '@/common/guards'
import * as svgCaptcha from 'svg-captcha'
import { ChangePasswordDto, RegisterUserDto } from './auth.dto'
import { UserService } from '@/modules/user/user.service'
import { AuthService } from './auth.service'
import { LoggerService } from '@/core/logger/logger.service'
import { EmailService } from '@/core/email/email.service'
import { responseFail } from '@/utils'
import { NoCache } from '@/common/decorators/no-cache.decorator'

@ApiTags('认证授权')
@Controller('auth')
export class AuthController {
  constructor(
    private logger: LoggerService,
    private emailService: EmailService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @ApiOperation({ summary: '获取邮箱验证码' })
  @Get('verifyCode')
  async getVerifyCode(@Query('email') email: string, @Res() res) {
    if (!email) {
      return responseFail(400, '缺少email参数')
    }

    // 验证email格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return responseFail(400, '无效的email格式')
    }

    // 生成验证码并发送邮件
    const code = this.generateVerifyCode(4)

    this.logger.debug('获取邮箱验证码', 'AuthController.getVerifyCode', { email, code })
    await this.emailService.getVerifyCode(email, code)
    return null
  }
  /**
   * 创建一个6位数的code
   */
  protected generateVerifyCode(length = 6) {
    let code = ''
    for (let i = 1; i <= length; i++) {
      code += Math.floor(Math.random() * 10)
    }
    return code
  }

  // 生成图片验证码
  @Get('captcha')
  @NoCache() // 对于需要实时性刷新的接口禁用缓存
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
      this.logger.error('会话未初始化', 'AuthController.createCaptcha')
      return responseFail(500, '会话未初始化')
    }

    // 显式检查验证码文本
    if (!captcha.text) {
      this.logger.error('验证码生成失败', 'AuthController.createCaptcha')
      return responseFail(500, '验证码生成失败')
    }

    // 增加session存储日志
    this.logger.debug('验证码已存储', 'AuthController.createCaptcha', { code: req.session.code })

    req.session.code = captcha.text
    req.session.codeExpireTime = Date.now() + 5 * 60 * 1000 // 5分钟过期

    res.type('image/svg+xml')
    res.send(captcha.data)
  }

  @ApiOperation({ summary: '注册' })
  @Post('register')
  async register(@Body() user: RegisterUserDto) {
    return this.userService.register(user)
  }

  @ApiOperation({ summary: '登录' })
  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req: any, @Body() body) {

    if (!req.session) {
      this.logger.error('会话未初始化', null, 'AuthController.login')
      return responseFail(500, '会话未初始化')
    }

    if (!req.session.code) {
      this.logger.error('验证码读取失败', null, 'AuthController.login')
      return responseFail(500, '验证码读取失败')
    }

    // 增加验证码过期检查
    if (req.session?.codeExpireTime && Date.now() > req.session.codeExpireTime) {
      return responseFail(500, '验证码已过期,请重新获取')
    }

    if (req.session?.code?.toLocaleLowerCase() !== body.captcha?.toLocaleLowerCase()) {
      this.logger.error('验证码错误', null, 'AuthController.login')
      return responseFail(500, '验证码错误')
    }

    // 检查用户是否存在
    const user = await this.userService.findByEmail(body.email)
    if (!user) {
      return responseFail(500, '用户未注册')
    }

    this.logger.log('用户登录', 'AuthController.login', { data: req.session })

    return this.authService.login(req.user, req.session?.code)
  }

  @ApiOperation({ summary: '刷新token' })
  @Post('refreshToken')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken)
  }

  @ApiOperation({ summary: '退出登录' })
  @Post('logout')
  @UseGuards(JwtGuard)
  async logout(@Req() req: any) {
    return this.authService.logout(req.user)
  }

  @ApiOperation({ summary: '修改密码' })
  @Post('password')
  @UseGuards(JwtGuard)
  async changePassword(@Req() req: any, @Body() body: ChangePasswordDto) {
    const ret = await this.authService.validateUser(req.user.email, body.oldPassword)
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
