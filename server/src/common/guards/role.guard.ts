import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ErrorInfo } from '@/common/constants/result-code'
import { ApiException } from '../exceptions/api.exception'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const { user } = request
    const currentRoleCode = user.currentRoleCode
    const roles = this.reflector.get<string[]>('roles', context.getHandler())
    // 当前用户没有角色
    if (!currentRoleCode) {
      throw new ApiException(ErrorInfo.ERR_11005)
    }
    if (!roles?.length) return true
    // 当前角色不在可操作角色范围内
    if (!roles.includes(currentRoleCode)) {
      throw new ApiException(ErrorInfo.ERR_11003)
    }
    return true
  }
}
