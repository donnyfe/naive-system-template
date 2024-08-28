import 'virtual:uno.css'
import App from './App.vue'
import { setupRouter } from '@/router'
import { setupPinia } from '@/store'
import AppLoading from './components/app-loading.vue'
import { setupDirectives } from './directives'
import { setupI18n } from './il8n'
import '@/styles/index.css'

async function setupApp() {
	// 载入全局loading加载状态
	const appLoading = createApp(AppLoading)
	appLoading.mount('#appLoading')

	// 创建vue实例
	const app = createApp(App)

	setupPinia(app)
	setupDirectives(app)
	setupI18n(app)

	await setupRouter(app)
	// 卸载载入动画
	appLoading.unmount()
	// 挂载
	app.mount('#app')

	app.config.errorHandler = (err, vm, info) => {
		console.error('全局错误处理器捕获到异常：', err, info)
	}
}
setupApp()

window.addEventListener('unhandledrejection', (error) => {
	console.error('全局错误处理器捕获到Promise异常：', error.reason)
})
