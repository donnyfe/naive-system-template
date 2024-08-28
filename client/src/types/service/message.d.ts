/// <reference path="../global.d.ts"/>


interface MessageData {
	id: number
	type: 0 | 1 | 2
	title: string
	icon: string
	tagTitle?: string
	tagType?: 'error' | 'info' | 'success' | 'warning'
	description?: string
	isRead?: boolean
	date: any
}
