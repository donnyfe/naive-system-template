import type { Result } from '@/http/request'
import type { UserData } from '../system/users/types'
import type { LoginData, LoginParam, RegisterParam } from './types'
import http from '@/http/request'

export const register = async (params: RegisterParam) =>
	http.post<Result<any>>('/api/auth/register', params)

export const login = async (params: LoginParam) =>
	http.post<Result<LoginData>>('/api/auth/login', params)

export const logout = async () => http.post<Result<any>>('/api/auth/logout')

export const updateToken = async (data: any) =>
	http.post<Result<LoginData>>('/api/auth/refresh/token', data)

export const queryUserInfo = async () => http.get<Result<UserData>>('/api/user/detail')

export async function queryUserRoutes(params: { id: number }) {
	return http.get<Result<RowRoute[]>>('/api/user/getUserRoutes', { params })
}
