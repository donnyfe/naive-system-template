import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  constructor() {
    super()
  }

  // 重写 canActivate 添加自定义逻辑
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 调用父类的 canActivate 保留原有验证
    return super.canActivate(context)
  }

  // 处理验证失败的情况
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new Error('Authentication failed')
    }
    return user
  }
}
