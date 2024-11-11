export interface PaginList<T> {
	list: T
	count: number
}

export interface UserParams {
	id?: number
	username?: string
	nickname?: string
	sex?: 0 | 1
	avatar?: string
	email?: string
	phone?: string
	roles?: RoleCode[]
	remark?: string
}

export interface UserData extends UserParams {
	id?: number
}
