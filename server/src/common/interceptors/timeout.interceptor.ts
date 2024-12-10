import { responseFail } from '@/utils';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const timeoutDuration = 60 * 1000; // 设置超时时间 60s，单位是毫秒

    return next.handle().pipe(
      timeout(timeoutDuration),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          // 处理超时错误
          return responseFail(504, '请求超时')
        }
        return err
      }),
    );
  }
}
