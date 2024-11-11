import { setupRouter } from '@/router'
import { setupPinia } from '@/store'
import App from './App.vue'
import AppLoading from './components/app-loading.vue'
import { setupDirectives } from './directives'
import { setupI18n } from './il8n'
import 'virtual:uno.css'
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
		// 区分开发环境和生产环境的错误处理
		if (import.meta.env.DEV) {
			console.error('错误信息:', err)
			console.error('错误组件:', vm)
			console.error('错误详情:', info)
		} else {
			// 生产环境错误上报
			// TODO: 监控错误上报
			// 生产环境错误上报
			errorReport({
				error: err,
				component: vm?.$options?.name,
				info,
				url: window.location.href,
				time: new Date().toISOString()
			})
		}
		// 显示友好的错误提示
		$message.error('系统出现异常,请稍后重试')
	}
}
setupApp()

// 添加错误上报函数
function errorReport(error: any) {
	// 上报到监控平台
	console.error(error)
}
