import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compareSync } from 'bcryptjs'
import { LoggerService } from '@/core/logger/logger.service'
import { RedisService } from '@/core/redis/redis.service'
import { UserService } from '@/modules/user/user.service'
import { responseFail } from '@/utils'
import {
  UserNotRegisteredException,
  InvalidCredentialsException,
} from '@/common/exceptions/business.exception'



@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private configService: ConfigService,
    private logger: LoggerService,
  ) {}

  /**
   * 验证用户
   * @param username 用户名
   * @param password 密码
   * @returns 用户信息
   */
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email)

    if (!user?.email) {
      this.logger.warn(`用户未注册: ${email}`)
      throw new UserNotRegisteredException()
    }

    if (!compareSync(password, user.password)) {
      this.logger.warn(`用户名或密码错误: ${email}`)
      throw new InvalidCredentialsException()
    }
    const { password: _, ...result } = user
    return result
  }

  async login(user: any, captcha?: string) {
    const payload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      captcha,
    }

    this.logger.log('登录成功', 'AuthService.login', payload)
    // 签发token
    const token = this.generateToken(payload)
    return token
  }

  /**
   * 获取token的key
   * @param payload 载荷
   * @returns token的key
   */
  getAccessTokenKey(payload: any) {
    return `${payload.userId}${payload.captcha ? ':' + payload.captcha : ''}`
  }

  /**
   * 生成token
   * @param payload 载荷
   * @returns token
   */
  generateToken(payload: any) {
    const accessToken = this.jwtService.sign(payload)
    // token过期时间
    const expiredTime = this.configService.get('redis.ttl')

    this.redisService.set(this.getAccessTokenKey(payload), accessToken, expiredTime)
    return {
      accessToken,
    }
  }

  /**
   * 退出登录
   * @param user 用户
   * @returns 是否成功
   */
  async logout(user: any) {
    if (user.userId) {
      await Promise.all([
        // 删除token
        this.redisService.del(this.getAccessTokenKey(user)),
      ])
      return true
    }
    return false
  }
}
