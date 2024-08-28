import { mergeConfig } from 'vite'
import baseConfig from './vite.config.base'
// import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default mergeConfig({
	mode: 'dev',
	plugins: [
		// VueDevTools()
	],
	// 依赖预构建
	optimizeDeps: {
		include: [
			'vue',
			'pinia',
			'vue-router',
			'@vueuse/core',
		]
	},
	server: {
		host: '0.0.0.0',
		port: 5173,
		open: false,
		proxy: {
			'/api': {
				target: 'http://localhost:8085',
				changeOrigin: true,
				rewrite: (path: string) => path.replace(/^\/api/, ''),
				secure: false,
				configure: (proxy: any, options: any) => {
					// 配置此项可在响应头中看到请求的真实地址
					proxy.on('proxyRes', (proxyRes: any, req:any) => {
						proxyRes.headers['x-real-url'] = new URL(req.url || '', options.target)?.href || ''
					})
				}
			}
		}
	}
}, baseConfig)
