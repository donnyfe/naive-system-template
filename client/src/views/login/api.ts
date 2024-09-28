import http, { Result } from '@/utils/request'
import { RegisterParam, LoginParam, LoginData } from './types'
import { UserData } from '../users/types'

export const register = (params: RegisterParam) => http.post<Result<any>>('/auth/register', params)

export const login = (params: LoginParam) => http.post<Result<LoginData>>('/auth/login', params)

export const logout = () => http.post<Result<any>>('/auth/logout')

export const updateToken = (data: any) => http.post<Result<LoginData>>('/auth/refresh/token', data)

export const queryUserInfo = () => http.get<Result<UserData>>('/user/detail')

export function queryUserRoutes(params: { id: number }) {
	return http.get<Result<RowRoute[]>>('/getUserRoutes', { params })
}
