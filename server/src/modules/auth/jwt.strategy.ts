import { ErrorInfo } from '@/common/constants/result-code'
import { ACCESS_TOKEN_EXPIRATION_TIME } from '@/common/constants/redis'
import { RedisService } from '@/shared/redis.service'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserService } from '../user/user.service'
import { AuthService } from './auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    protected configService: ConfigService,
    private redisService: RedisService,
    private userService: UserService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwt.secret'),
      ignoreExpiration: false,
      passReqToCallback: true,
    })
  }

  async validate(req, payload: any) {
    // 从请求头中提取JWT
    const bearerToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req)
    // 从Redis中获取用户访问令牌
    const accessToken = await this.redisService.get(this.authService.getAccessTokenKey(payload))

    // 如果请求令牌不等于访问令牌
    if (bearerToken !== accessToken) {
      this.redisService.del(this.authService.getAccessTokenKey(payload))
      throw new HttpException(ErrorInfo.ERR_11002, HttpStatus.UNAUTHORIZED)
    }

    // 延长token过期时间
    this.redisService.set(
      this.authService.getAccessTokenKey(payload),
      accessToken,
      // token失效时间
      ACCESS_TOKEN_EXPIRATION_TIME,
    )

    return {
      userId: payload.userId,
      username: payload.username,
      roleCodes: payload.roleCodes || [],
      currentRoleCode: payload.currentRoleCode,
      captcha: payload.captcha,
    }
  }
}
