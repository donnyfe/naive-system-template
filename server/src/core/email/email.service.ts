import { Injectable } from '@nestjs/common'
import { MailerService, type ISendMailOptions } from '@nestjs-modules/mailer'
import { RedisService } from '@/core/redis/redis.service'
import { LoggerService } from '@/core/logger/logger.service'
import { responseFail, responseSuccess } from '@/utils'

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly redisService: RedisService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * 发送邮箱验证码
   */
  public async getVerifyCode(email: string, code: string) {
    const mailOptions: ISendMailOptions = {
      from: '"Nest平台" <donnyfe@qq.com>',
      to: email,
      subject: '注册验证码',
      html: `验证码 ${code} 用于平台身份验证，3分钟内有效。请勿泄漏和转发。如非本人操作，请忽略此条短信。`,
    }

    try {
      await this.redisService.set(email, code, 60 * 3 * 1000) // 验证码3分钟有效期

      this.logger.log('邮箱验证码发送成功', 'email.getVerifyCode')
      await this.sendEmail(mailOptions)

      return null
    } catch (error) {
      this.logger.error('邮箱验证码发送失败', error, 'email.getVerifyCode')
      return responseFail(500, '发送失败')
    }
  }

  public async sendEmail(options: ISendMailOptions) {
    const mailOptions = Object.assign(
      {
        from: 'donnyfe@qq.com',
        to: 'donnyfe@qq.com',
        subject: 'Hello',
        template: 'welcome',
      },
      options,
    )

    try {
      return await this.mailerService.sendMail(mailOptions)
    } catch (error) {
      this.logger.error('发送邮箱失败', error, 'email.sendEmail')
      return null
    }
  }
}
