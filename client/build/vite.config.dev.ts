import { mergeConfig } from 'vite'
import baseConfig from './vite.config.base'

// https://vitejs.dev/config/
export default mergeConfig(
	{
		mode: 'development',
		plugins: [],
		// 依赖预构建
		optimizeDeps: {
			include: ['vue', 'pinia', 'vue-router', '@vueuse/core']
		},
		server: {
			host: '0.0.0.0',
			port: 5173,
			open: false,
			cors: true, // 启用CORS
			proxy: {
				'/api': {
					target: 'http://localhost:3000/api',
					changeOrigin: true,
					rewrite: (path: string) => path.replace(/^\/api/, ''),
					secure: false,
					ws: false, // 支持WebSocket
					timeout: 60 * 1000, // 60秒
					configure: (proxy: any, options: any) => {
						// 配置此项可在响应头中看到请求的真实地址
						proxy.on('proxyRes', (proxyRes: any, req: any) => {
							proxyRes.headers['x-real-url'] = new URL(req.url || '', options.target)?.href || ''
						})
					}
				}
			}
		}
	},
	baseConfig
)
