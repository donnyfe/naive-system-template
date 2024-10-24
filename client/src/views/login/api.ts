import type { Result } from '@/utils/request'
import type { UserData } from '../users/types'
import type { LoginData, LoginParam, RegisterParam } from './types'
import http from '@/utils/request'

export const register = async (params: RegisterParam) => http.post<Result<any>>('/auth/register', params)

export const login = async (params: LoginParam) => http.post<Result<LoginData>>('/auth/login', params)

export const logout = async () => http.post<Result<any>>('/auth/logout')

export const updateToken = async (data: any) => http.post<Result<LoginData>>('/auth/refresh/token', data)

export const queryUserInfo = async () => http.get<Result<UserData>>('/user/detail')

export async function queryUserRoutes(params: { id: number }) {
	return http.get<Result<RowRoute[]>>('/getUserRoutes', { params })
}
