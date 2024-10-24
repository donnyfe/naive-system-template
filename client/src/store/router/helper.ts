import type { MenuOption } from 'naive-ui'
import type { RouteRecordRaw } from 'vue-router'
import { usePermission } from '@/hooks'
import Layout from '@/layouts/index.vue'
import { $t, arrayToTree, renderIcon } from '@/utils'
import { clone, min, omit, pick } from 'radash'
import { RouterLink } from 'vue-router'

const metaFields: MetaKeys[] = [
	'title',
	'icon',
	'requiresAuth',
	'roles',
	'keepAlive',
	'hide',
	'order',
	'href',
	'activeMenu',
	'withoutTab',
	'pinTab',
	'menuType'
]

// 标准化路由元信息
function standardizedRoutes(route: RowRoute[]) {
	return clone(route).map((i) => {
		const route = omit(i, metaFields)

		Reflect.set(route, 'meta', pick(i, metaFields))
		return route
	}) as Route[]
}

export function createRoutes(routes: RowRoute[]) {
	const { hasPermission } = usePermission()

	// meta元信息结构化
	let resultRouter = standardizedRoutes(routes)

	// 路由权限过滤
	resultRouter = resultRouter.filter(item => hasPermission(item.meta.roles))

	// 动态导入路由
	const modules = import.meta.glob('@/views/**/*.vue')

	resultRouter = resultRouter.map((item: Route) => {
		if (item.componentPath && !item.redirect)
			item.component = modules[`/src/views${item.componentPath}`]
		return item
	})

	// 转树结构
	resultRouter = arrayToTree(resultRouter) as Route[]

	const appRootRoute: RouteRecordRaw = {
		path: '/appRoot',
		name: 'appRoot',
		redirect: import.meta.env.VITE_HOME_PATH,
		component: Layout,
		meta: {
			title: '',
			icon: 'icon-park-outline:home'
		},
		children: []
	}

	setRedirect(resultRouter)

	appRootRoute.children = resultRouter as unknown as RouteRecordRaw[]
	return appRootRoute
}

export function generateCacheRoutes(routes: RowRoute[]) {
	return routes.filter(i => i.keepAlive).map(i => i.name)
}

function setRedirect(routes: Route[]) {
	routes.forEach((route) => {
		if (route.children) {
			if (!route.redirect) {
				const visibleChilds = route.children.filter(child => !child.meta.hide)

				let target = visibleChilds[0]

				const orderChilds = visibleChilds.filter(child => child.meta.order)

				if (orderChilds.length > 0)
					target = min(orderChilds, i => i.meta.order!) as Route

				if (target)
					route.redirect = target.path
			}

			setRedirect(route.children)
		}
	})
}

export function createMenus(userRoutes: RowRoute[]) {
	const resultMenus = standardizedRoutes(userRoutes)

	const visibleMenus = resultMenus.filter(route => !route.meta.hide)

	return arrayToTree(transformAuthRoutesToMenus(visibleMenus))
}

function transformAuthRoutesToMenus(userRoutes: Route[]) {
	const { hasPermission } = usePermission()

	return userRoutes
		.filter(i => hasPermission(i.meta.roles))
		.sort((a, b) => {
			if (a.meta && a.meta.order && b.meta && b.meta.order)
				return a.meta.order - b.meta.order
			else if (a.meta && a.meta.order)
				return -1
			else if (b.meta && b.meta.order)
				return 1
			else return 0
		})
		.map((item) => {
			const target: MenuOption = {
				id: item.id,
				pid: item.pid,
				label:
					!item.meta.menuType || item.meta.menuType === 'page'
						? () =>
							h(
								RouterLink,
								{
									to: {
										path: item.path
									}
								},
								{ default: () => $t(`route.${String(item.name)}`, item.meta.title) }
							)
						: () => $t(`route.${String(item.name)}`, item.meta.title),
				key: item.path,
				icon: item.meta.icon ? renderIcon(item.meta.icon) : undefined
			}
			return target
		})
}
