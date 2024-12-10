import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, StrategyOptions } from 'passport-local'
import { AuthService } from './auth.service'
import { decrypt } from '@/utils/aes'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authSerevice: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    } as StrategyOptions)
  }

  async validate(email: string, password: string): Promise<any> {

    const user = await this.authSerevice.validateUser(email, decrypt(password))

    if (!user || !user?.email) {
      throw new UnauthorizedException('用户名或密码错误')
    }

    return user
  }
}
