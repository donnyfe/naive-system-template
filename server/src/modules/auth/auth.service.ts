import { ConfigService } from '@nestjs/config'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compareSync } from 'bcryptjs'
import { LoggerService } from '@/core/logger/logger.service'
import { RedisService } from '@/core/redis/redis.service'
import { UserService } from '@/modules/user/user.service'

import {
  UserNotFoundException,
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
      throw new UserNotFoundException()
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
    return `assess_token:${payload.email}_${payload.username}`
  }

  /**
   * 获取refresh token的key
   * @param payload 载荷
   * @returns refresh token的key
   */
  getRefreshTokenKey(payload: any) {
    return `refresh_token:${payload.userId}`
  }

  /**
   * 生成token
   * @param payload 载荷
   * @returns token
   */
  generateToken(payload: any) {
    // 生成 access token
    // access token payload包含完整用户信息
    const accessPayload = {
      type: 'access',
      userId: payload.id,
      username: payload.username,
      email: payload.email,
    }

    const accessToken = this.jwtService.sign(accessPayload, {
      secret: this.configService.get('security.jwt.secret'),
      expiresIn: this.configService.get('security.jwt.expiresIn'),
    })

    // 生成 refresh token
    const refreshPayload = {
      type: 'refresh',
      userId: payload.userId,
    }
    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.configService.get('security.jwt.refreshSecret'),
      expiresIn: this.configService.get('security.jwt.refreshExpiresIn'),
    })

    // token过期时间
    const accessTokenTTL = this.configService.get('redis.tokenTTL')
    const refreshTokenTTL = this.configService.get('redis.refreshTokenTTL')

    // 将token存入redis并设置过期时间
    this.redisService.set(this.getAccessTokenKey(accessPayload), accessToken, accessTokenTTL)
    this.redisService.set(this.getRefreshTokenKey(refreshPayload), refreshToken, refreshTokenTTL)

    return {
      accessToken,
      refreshToken,
    }
  }

  /**
   * 刷新token
   * @param refreshToken 刷新token
   * @returns 新的token
   */
  async refreshToken(refreshToken: string) {
    try {
      // 验证 refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('security.jwt.refreshSecret'),
      })

      // 验证token类型
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type')
      }

      // 检查 Redis 中是否存在该 refresh token
      const storedToken = await this.redisService.get(this.getRefreshTokenKey(payload))
      if (!storedToken || storedToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token')
      }

      // 删除旧的 refresh token
      await this.redisService.del(this.getRefreshTokenKey(payload))

      // 生成新的 token pair (rotation)
      return this.generateToken(payload)
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token')
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
