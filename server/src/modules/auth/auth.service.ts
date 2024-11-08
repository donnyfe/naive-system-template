import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compareSync } from 'bcryptjs'
import { UserService } from '@/modules/user/user.service'
import { RedisService } from '@/shared/redis.service'
import { ACCESS_TOKEN_EXPIRATION_TIME } from '@/common/constants/redis'
import { ConfigService } from '@nestjs/config'
import { responseSuccess } from '@/utils'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username)
    if (user && compareSync(password, user.password)) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: any, captcha?: string) {
    const payload = {
      userId: user.id,
      username: user.username,
      captcha,
    }
    const token = this.generateToken(payload)
    return responseSuccess(token, '登录成功')
  }

  generateToken(payload: any) {
    const accessToken = this.jwtService.sign(payload)
    this.redisService.set(this.getAccessTokenKey(payload), accessToken, ACCESS_TOKEN_EXPIRATION_TIME)
    return {
      accessToken,
    }
  }

  async logout(user: any) {
    if (user.userId) {
      await Promise.all([this.redisService.del(this.getAccessTokenKey(user))])
      return true
    }
    return false
  }

  getAccessTokenKey(payload: any) {
    return `${payload.userId}${payload.captcha ? ':' + payload.captcha : ''}`
  }
}
