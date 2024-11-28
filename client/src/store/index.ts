import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'

export * from './app'
export * from './auth'
export * from './router'
export * from './tab'

const pinia = createPinia()
pinia.use(piniaPluginPersist)

// 自定义日志插件
// pinia.use(({ store }) => {
// 	store.$subscribe((mutation, state) => {
// 		if (import.meta.env.VITE_MODE !== 'prod') {
// 			console.log(`[${store.$id}]: ${mutation.type}`, mutation, state)
// 		}
// 	})
// })

// 安装pinia全局状态库
export function setupPinia(app: App) {
	app.use(pinia)
}

