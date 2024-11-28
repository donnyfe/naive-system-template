export const staticRoutes: RowRoute[] = [
	{
		name: 'chat',
		path: '/chat',
		title: '聊天助理',
		requiresAuth: true,
		icon: 'icon-park-outline:user',
		menuType: 'page',
		componentPath: '/chat/index.vue',
		pid: null,
		id: 1
	},
	// {
	// 	name: 'file',
	// 	path: '/file',
	// 	title: '文件上传',
	// 	hide: false,
	// 	requiresAuth: true,
	// 	icon: 'icon-park-outline:file-addition',
	// 	componentPath: '/file/index.vue',
	// 	pid: null,
	// 	id: 2
	// },

	// {
	// 	name: 'imageRecognition',
	// 	path: '/image-recognition',
	// 	title: '图像识别',
	// 	requiresAuth: true,
	// 	icon: 'icon-park-outline:image-files',
	// 	pinTab: true,
	// 	menuType: 'page',
	// 	componentPath: '/image-recognition/index.vue',
	// 	pid: null,
	// 	id: 3
	// },
	// {
	// 	name: 'system',
	// 	path: '/system',
	// 	title: '系统管理',
	// 	requiresAuth: true,
	// 	icon: 'icon-park-outline:computer',
	// 	menuType: 'dir',
	// 	componentPath: null,
	// 	pid: null,
	// 	id: 97
	// },
	// {
	// 	name: 'users',
	// 	path: '/system/users',
	// 	title: '用户管理',
	// 	requiresAuth: true,
	// 	icon: 'icon-park-outline:every-user',
	// 	// menuType: 'page',
	// 	componentPath: '/system/users/index.vue',
	// 	pid: null,
	// 	id: 2
	// },
	// {
	// 	name: 'role',
	// 	path: '/system/role',
	// 	title: '角色管理',
	// 	requiresAuth: true,
	// 	icon: 'icon-park-outline:user-business',
	// 	menuType: 'page',
	// 	componentPath: '/system/role/index.vue',
	// 	pid: 97,
	// 	id: 3
	// },

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
		pinTab: false,
		pid: null,
		id: 99
	}
]
