import type { App } from 'vue'
import piniaPluginPersist from 'pinia-plugin-persist'

export * from './router'
export * from './app'
export * from './auth'
export * from './tab'

const store = createPinia()
store.use(piniaPluginPersist)

// 安装pinia全局状态库
export function setupPinia(app: App) {
  app.use(store)
}

export { store }
