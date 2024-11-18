import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.strategy'
import { UserModule } from '../../modules/user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { RedisModule } from '@/core/redis/redis.module'
@Module({
  imports: [
    RedisModule,
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('security.jwt.secret'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
