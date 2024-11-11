export interface Role {
	id: number
	code: string
	name: string
	remark?: string
	sort?: number
	status: number
	createTime: string
	updateTime: string
}

// 获取角色列表的参数接口
export interface GetRoleListParams {
	pageNumber?: number
	pageSize?: number
	name?: string
	code?: string
	status?: number | null
}

// 创建角色的参数接口
export interface CreateRoleParams {
	name: string
	code: string
	description?: string
	status?: number
}

// 更新角色的参数接口
export interface UpdateRoleParams {
	id: number
	name?: string
	code?: string
	description?: string
	status?: number
}

// 分配角色的参数接口
export interface AssignRoleParams {
	userId: number
	roleIds: number[]
}
