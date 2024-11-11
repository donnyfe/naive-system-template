import type { MessageApi, LoadingBarApi, DialogApi, NotificationApi } from 'naive-ui'

declare global {
	const $message: MessageApi

	interface Window {
		$loadingBar: LoadingBarApi
		$dialog: DialogApi
		$message: MessageApi
		$notification: NotificationApi
	}

	// 如果使用 setup 语法糖,还需要声明组件实例的类型
	declare module 'vue' {
		interface ComponentCustomProperties {
			$loadingBar: LoadingBarApi
			$dialog: DialogApi
			$message: MessageApi
			$notification: NotificationApi
		}
	}
}

export type Lang = 'zhCN' | 'enUS'

export interface SessionStorageData {
	demoKey: string
}

export interface LocalStorageData {
	/* 存储用户信息 */
	userInfo: LoginData
	/* 存储访问token */
	accessToken: string
	/* 存储刷新token */
	refreshToken: string
	/* 存储登录账号 */
	loginAccount: any
	/* 存储当前语言 */
	lang: Lang
}

export interface StorageData<T> {
	value: T
	expire: number | null
}

export {}
