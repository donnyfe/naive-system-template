declare namespace App {
	type lang = 'zhCN' | 'enUS'
}

interface SessionStorageData {
	demoKey: string
}

interface LocalStorageData {
	/* 存储用户信息 */
	userInfo: LoginData
	/* 存储访问token */
	accessToken: string
	/* 存储刷新token */
	refreshToken: string
	/* 存储登录账号 */
	loginAccount: any
	/* 存储当前语言 */
	lang: App.lang
}

interface Window {
	$loadingBar: import('naive-ui').LoadingBarApi
	$dialog: import('naive-ui').DialogApi
	$message: import('naive-ui').MessageApi
	$notification: import('naive-ui').NotificationApi
}
