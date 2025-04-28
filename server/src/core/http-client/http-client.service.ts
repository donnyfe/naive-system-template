import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Observable, retry, timeout } from 'rxjs'

@Injectable()
export class HttpClientService {
  constructor(private readonly httpService: HttpService) {}

  request<T>(config: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return this.httpService.request<T>(config).pipe(
      timeout(5000),
      retry({
        count: 3,
        delay: 1000,
      }),
    )
  }

  get<T>(url: string, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }
}
