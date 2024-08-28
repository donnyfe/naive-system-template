import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ApiException } from '@/common/exceptions/api.exception'
import { ErrorInfo } from '@/common/constants/result-code'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const { user } = request
    // 当前角色不在可操作角色范围内
    if (!user.currentRoleCode) throw new ApiException(ErrorInfo.ERR_11005)

    const roles = this.reflector.get<string[]>('roles', context.getHandler())
    if (!roles?.length) return true
    const hasRole = roles.includes(user.currentRoleCode)
    if (!hasRole) throw new ApiException(ErrorInfo.ERR_11003)
    return true
  }
}
