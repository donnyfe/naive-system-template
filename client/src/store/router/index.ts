import type { MenuOption } from 'naive-ui'
import { router } from '@/router'
import { staticRoutes } from '@/router/static-routes'
import { $t } from '@/il8n'
import { createMenus, createRoutes, generateCacheRoutes } from './helper'

interface RoutesStatus {
	isInitAuthRoute: boolean
	menus: MenuOption[]
	rowRoutes: RowRoute[]
	activeMenu: string | null
	cacheRoutes: string[]
}
export const useRouteStore = defineStore('route-store', {
	state: (): RoutesStatus => {
		return {
			isInitAuthRoute: false,
			activeMenu: null,
			menus: [],
			rowRoutes: [],
			cacheRoutes: []
		}
	},
	actions: {
		resetRouteStore() {
			this.resetRoutes()
			this.$reset()
		},
		resetRoutes() {
			if (router.hasRoute('appRoot')) router.removeRoute('appRoot')
		},
		// set the currently highlighted menu key
		setActiveMenu(key: string) {
			this.activeMenu = key
		},

		async getRoutes() {
			// 静态路由
			this.rowRoutes = staticRoutes
			return staticRoutes
		},
		async initAuthRoute() {
			this.isInitAuthRoute = false

			// 获取路由
			const rowRoutes = await this.getRoutes()
			if (!rowRoutes) {
				$message.error($t('app.getRouteError'))
				return
			}
			this.rowRoutes = rowRoutes

			// 生成路由
			const routes = createRoutes(rowRoutes)
			router.addRoute(routes)

			// 创建侧边栏菜单
			this.menus = createMenus(rowRoutes)

			// 缓存路由
			this.cacheRoutes = generateCacheRoutes(rowRoutes)

			this.isInitAuthRoute = true
		}
	}
})
