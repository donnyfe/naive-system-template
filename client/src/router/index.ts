import type { App } from 'vue'
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import { routes } from './routes'
import { setupRouterGuard } from './guard'

const { VITE_ROUTE_MODE = 'hash', VITE_BASE_URL } = import.meta.env

export const router = createRouter({
  history:
		VITE_ROUTE_MODE === 'hash'
			? createWebHashHistory(VITE_BASE_URL)
			: createWebHistory(VITE_BASE_URL),
  routes,
})

export async function setupRouter(app: App) {
  // 添加路由守卫
  setupRouterGuard(router)
  app.use(router)

	// https://router.vuejs.org/zh/api/index.html#isready
	await router.isReady()
}
