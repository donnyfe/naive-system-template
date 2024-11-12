import type {
	AxiosError,
	AxiosInstance,
	CustomParamsSerializer,
	InternalAxiosRequestConfig
} from 'axios'
import { $t } from '@/il8n'
import { local } from '@/utils/storage'
import axios from 'axios'
import { stringify } from 'qs'

declare module 'axios' {
	// 拓展axios请求配置
	interface InternalAxiosRequestConfig {
		// 是否为上传文件
		isUpload?: boolean
		// 是否为json格式
		isJson?: boolean

		// 重试次数计数器
		retryCount?: number
		// 是否开启重试
		isRetry?: boolean
		// 最大重试次数
		retryLimit?: number
		// 重试间隔时间(ms)
		retryInterval?: number
	}
}

export interface Result<T> {
	code: number
	data: T
	message: string
	success: boolean
}

type ErrorStatus = keyof typeof ERROR_MESSAGE_MAP
type ErrorCode = keyof typeof ERROR_CODE

/** 请求不成功各种状态的错误 */
const ERROR_DEFAULT_MESSAGE = $t('http.defaultTip')
const ERROR_MESSAGE_MAP = {
	400: $t('http.400'),
	401: $t('http.401'),
	403: $t('http.403'),
	404: $t('http.404'),
	405: $t('http.405'),
	408: $t('http.408'),
	500: $t('http.500'),
	501: $t('http.501'),
	502: $t('http.502'),
	503: $t('http.503'),
	504: $t('http.504'),
	505: $t('http.505')
}

const ERROR_CODE = {
	...ERROR_MESSAGE_MAP,
	10001: $t('http.10001'),
	10002: $t('http.10002'),
	10005: $t('http.10005'),
	10031: $t('http.10031')
}

class Http {
	baseUrl: string = import.meta.env.VITE_AXIOS_BASE_URL
	whiteList: string[] = [] // 接口白名单
	axiosInstance: AxiosInstance
	constructor() {
		const defaultConfig = {
			// 请求基础路径
			baseURL: this.baseUrl,
			// 请求超时
			timeout: 60 * 1000,
			// 请求头
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				'X-Requested-With': 'XMLHttpRequest'
			},
			paramsSerializer: {
				serialize: stringify as unknown as CustomParamsSerializer
			}
		}
		// 请求实例
		this.axiosInstance = axios.create(defaultConfig)
		// 请求白名单
		this.whiteList = ['/auth/register', '/auth/login', '/auth/refreshToken']

		this.httpInterceptorsRequest()
		this.httpInterceptorsResponse()
	}

	// 请求拦截
	private httpInterceptorsRequest(): void {
		this.axiosInstance.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				// 处理请求头
				config = this.resolveRequestHeader(config)
				// 处理请求数据
				config = this.resolveRequestData(config)
				return config
			},
			async (error: AxiosError) => {
				return Promise.reject(error)
			}
		)
	}

	// 响应拦截
	private httpInterceptorsResponse(): void {
		this.axiosInstance.interceptors.response.use(
			async (response) => {
				const { data, status } = response
				if (status !== 200) {
					return Promise.reject(data)
				}

				if (data.code !== 200) {
					data.success = false
				}

				// 处理授权异常
				this.handleAuthError(data)
				// 处理其他异常
				this.handleGeneralError(data)

				return Promise.resolve(data)
			},
			async (error: AxiosError) => {
				const config = error.config as InternalAxiosRequestConfig
				// 重试配置
				config.retryCount = config.retryCount ?? 0
				const { isRetry, retryCount, retryInterval } = config

				if (isRetry && retryCount < 3) {
					config.retryCount++

					// 重试延迟
					await new Promise((resolve) => {
						setTimeout(resolve, retryInterval || 1000)
					})

					return this.axiosInstance(config)
				}
				Promise.reject(error)
			}
		)
	}

	// 处理请求头
	resolveRequestHeader(config: InternalAxiosRequestConfig) {
		// 根据请求的路由判断是否白名单内，非白名单需加token令牌
		if (!this.whiteList.includes(config.url as string)) {
			config.headers.Authorization = `Bearer ${local.get('accessToken') || ''}`
		}

		if (config.isUpload) {
			config.headers['Content-Type'] = 'multipart/form-data'
		}

		if (config.isJson === false) {
			config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
		}
		return config
	}

	// 处理请求数据
	resolveRequestData(config: InternalAxiosRequestConfig) {
		return config
	}

	// 处理授权异常
	handleAuthError(data: Result<unknown>): boolean {
		const { code, message } = data

		if (ERROR_CODE.hasOwnProperty(code)) {
			const msg = message || ERROR_CODE[code as ErrorCode] || ERROR_DEFAULT_MESSAGE

			$message.error(msg)
			// 授权错误，登出账户
			// logout()
			return false
		}

		return true
	}

	// 处理其他异常
	handleGeneralError(data: Result<unknown>): boolean {
		if (data.success === false) {
			return false
		}
		return true
	}

	// 处理网络异常
	handleNetworkError(status: ErrorStatus) {
		const errMsg: string = status
			? ERROR_MESSAGE_MAP[status] || ERROR_DEFAULT_MESSAGE
			: '无法连接到服务器！'
		$message.error(errMsg)
	}

	async get<T>(url: string, params?: object, config?: InternalAxiosRequestConfig): Promise<T> {
		return this.axiosInstance.get(url, { params, ...config })
	}

	async post<T>(url: string, data?: object, config?: InternalAxiosRequestConfig): Promise<T> {
		return this.axiosInstance.post(url, data, config)
	}

	async put<T>(url: string, params?: object, config?: InternalAxiosRequestConfig): Promise<T> {
		return this.axiosInstance.put(url, params, config)
	}

	async patch<T>(url: string, params?: object): Promise<T> {
		return this.axiosInstance.patch(url, params)
	}

	async delete<T>(url: string, params?: object): Promise<T> {
		return this.axiosInstance.delete(url, { params })
	}
}

const http = new Http()
export default http

export async function httpStream(url: string, data: any) {
	const token = local.get('accessToken')

	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'text/event-stream',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify(data)
	})

	if (!res.ok) {
		throw new Error(`HTTP error! status: ${res.status}`)
	}
	return res
}


