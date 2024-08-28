import http, { Result } from '@/utils/request'
import { UserData, UserParams } from './types'

// 获取用户列表
export const queryUserList = (params: UserParams) => http.get<Result<PaginList<UserData[]>>>('/user/list', params)
// 创建用户
export const createUser = (params: UserParams) => http.post<Result<any>>('/user/add', params)
// 更新用户
export const updateUser = (params: UserParams) => http.patch<Result<any>>(`/user/${params.id}`, params)
// 移除用户
export const removeUser = (id: string | number) => http.delete<Result<any>>(`/user/${id}`)

