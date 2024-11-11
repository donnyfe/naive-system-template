// directives/modules/performance.ts
import type { App, Directive } from 'vue'

export function install(app: App) {
	const performanceDirective: Directive = {
		mounted(el, binding) {
			// 记录组件渲染时间
			const startTime = performance.now()

			requestAnimationFrame(() => {
				const endTime = performance.now()
				const duration = endTime - startTime

				// 超过阈值告警
				if (duration > (binding.value || 16)) {
					console.warn(`组件渲染耗时${duration}ms, 超过阈值`)
				}

				// 上报性能数据
				reportPerformance({
					component: binding.arg,
					duration,
					page: window.location.pathname
				})
			})
		}
	}

	app.directive('performance', performanceDirective)
}

interface PerformanceData {
	component?: string
	duration: number
	page: string
}

function reportPerformance(data: PerformanceData) {
	// 上报到性能监控平台
}
