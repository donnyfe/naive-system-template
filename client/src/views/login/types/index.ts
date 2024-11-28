export type IFormType = 'loginForm' | 'registerForm' | 'resetPasswordForm'

export interface LoginParam {
	email: string
	password: string
	captcha: string
}

export type RegisterParam = Omit<LoginParam, 'captcha'>

/* 登录返回的用户字段 */
export interface LoginData {
	/** 访问toekn */
	accessToken: string
}
