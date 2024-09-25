export const staticRoutes: RowRoute[] = [
	{
		name: 'chat',
		path: '/chat',
		title: '聊天助手',
		requiresAuth: true,
		icon: 'icon-park-outline:user',
		pinTab: true,
		menuType: 'page',
		componentPath: '/chat/index.vue',
		pid: null,
		id: 1
	},
	{
		name: 'users',
		path: '/users',
		title: '用户管理',
		requiresAuth: true,
		icon: 'icon-park-outline:every-user',
		componentPath: '/users/index.vue',
		pid: null,
		id: 2
	},
	{
		name: 'file',
		path: '/file',
		title: '文件上传',
		hide: false,
		requiresAuth: true,
		icon: 'icon-park-outline:file-addition',
		componentPath: '/file/index.vue',
		pid: null,
		id: 97
	},
	{
		name: 'userCenter',
		path: '/user-center',
		title: '个人中心',
		hide: true,
		requiresAuth: true,
		icon: 'carbon:user-avatar-filled-alt',
		componentPath: '/user-center/index.vue',
		pid: null,
		id: 98
	},
	{
		name: 'about',
		path: '/about',
		title: '关于',
		hide: true,
		requiresAuth: true,
		icon: 'icon-park-outline:info',
		componentPath: '/about/index.vue',
		pid: null,
		id: 99
	}
]
