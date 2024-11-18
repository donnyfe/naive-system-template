import type { Result } from '@/http/request'
import type { UserData, UserParams } from './types'
import http from '@/http/request'

// 获取用户列表
export const queryUserList = async (params: UserParams) =>
	http.get<Result<PaginList<UserData[]>>>('/api/user/list', params)
// 创建用户
export const createUser = async (params: UserParams) => http.post<Result<any>>('/api/user/create', params)
// 更新用户
export const updateUser = async (params: UserParams) =>
	http.patch<Result<any>>(`/api/user/${params.id}`, params)
// 移除用户
export const removeUser = async (id: string | number) => http.delete<Result<any>>(`/api/user/${id}`)
