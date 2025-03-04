import { mergeConfig } from 'vite'
import { useImageminPlugin, useVisualizerPlugin } from './plugins'
import baseConfig from './vite.config.base'
import { deployToServer } from '@idonnyfe/vite-plugin-deploy-to-server'


export default mergeConfig(
	{
		mode: 'production',
		base: './',
		plugins: [
			// 图片压缩
			useImageminPlugin(),

			// 分析报告
			useVisualizerPlugin(),

			// 部署到服务器
			deployToServer({
				remotePath: '/root/web/admin/client',
				localPath: 'dist',
			})
		],
		build: {
			target: 'esnext',
			drop: ['debugger'],
			cssCodeSplit: true, // 启用 CSS 代码分割
			sourcemap: false, // 启用 sourcemap
			emptyOutDir: true, // 启用/禁用清空输出目录
			reportCompressedSize: false, // 启用/禁用 gzip 压缩大小报告
			assetsInlineLimit: 4096, // 启用/禁用 base64 内联资源, 4kb 以下使用 base64 内联
			chunkSizeWarningLimit: 500, // 启用/禁用 chunk 大小警告, 500kb 以下
			// 模块预加载
			modulePreload: {
				polyfill: false,
				resolveDependencies: (filename: string, deps: string[], context: any) => {
					// 根据文件名过滤需要预加载的依赖
					return deps.filter((dep: any) => {
						// 只预加载核心chunks
						return (
							// dep.includes('vue-vendor') ||
							// dep.includes('ui-vendor') ||
							dep.includes('utils-vendor')
						)
					})
				}
			},
			rollupOptions: {
				cache: true,
				output: {
					// 分包策略
					manualChunks: {
						'vue-vendor': ['vue', 'vue-router', 'pinia'],
						'ui-vendor': ['naive-ui'],
						'utils-vendor': ['axios', 'qs', 'dayjs', '@vueuse/core'],
						'libs-vendor': ['spark-md5', 'crypto-js'],
						'markdown-vendor': [
							'markdown-it',
							'markdown-it-link-attributes',
							'@traptitech/markdown-it-katex',
							'highlight.js'
						],
						'ai-vendor': ['@xenova/transformers']
					},
					// 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
					chunkFileNames: 'assets/js/[name]-[hash].js',
					// 用于输出静态资源的命名，[ext]表示文件扩展名
					assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
					// 拆分js到模块文件夹
					entryFileNames: 'assets/js/[name]-[hash].js'
				}
			}
		}
	},
	baseConfig
)
