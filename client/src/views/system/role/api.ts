import http, { type Result } from '@/http/request'
import { GetRoleListParams, CreateRoleParams, UpdateRoleParams, AssignRoleParams } from './types'

export function getRoleList(params: GetRoleListParams) {
	return http.get<Result<any>>('/api/role/list', { ...params })
}

export function createRole(data: CreateRoleParams) {
	return http.post<Result<any>>('/api/role', data)
}

export function updateRole(data: UpdateRoleParams) {
	return http.patch<Result<any>>(`/api/role/${data.id}`, data)
}

export function deleteRole(id: number) {
	return http.delete<Result<any>>(`/api/role/${id}`)
}

export function assignRole(data: AssignRoleParams) {
	return http.post<Result<any>>('/api/role/assign', data)
}

export function getUserRoles(userId: number) {
	return http.get<Result<any>>(`/api/role/user/${userId}`)
}
