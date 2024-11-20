import type { App } from 'vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { setupRouterGuard } from './guard'
import { routes } from './routes'

const { VITE_ROUTE_MODE = 'hash' } = import.meta.env

export const router = createRouter({
	history: VITE_ROUTE_MODE === 'hash' ? createWebHashHistory() : createWebHistory(),
	routes,
	scrollBehavior: () => ({ left: 0, top: 0 })
})

export async function setupRouter(app: App) {
	// 添加路由守卫
	setupRouterGuard(router)
	app.use(router)

	// https://router.vuejs.org/zh/api/index.html#isready
	await router.isReady()
}
