import { mergeConfig, loadEnv } from 'vite'
import { useImageminPlugin, useVisualizerPlugin } from './plugins'
import baseConfig from './vite.config.base'
import { deployToServer } from '@idonnyfe/vite-plugin-workflow'

const env = loadEnv('prod', process.cwd(), '')

export default mergeConfig(
	{
		mode: 'prod',
		envDir: '../',
		base: './',
		plugins: [
			// 图片压缩
			useImageminPlugin(),
			// 分析报告
			useVisualizerPlugin(),

			deployToServer({
				host: env.SSH_HOST,
				port: Number(env.SSH_PORT) || 22,
				username: env.SSH_USERNAME,
				password: env.SSH_PASSWORD,
				localPath: env.SSH_LOCAL_PATH,
				remotePath: env.SSH_REMOTE_PATH
			})
		],
		build: {
			target: 'esnext',
			drop: ['console', 'debugger'],
			sourcemap: true, // 启用 sourcemap
			reportCompressedSize: false, // 启用/禁用 gzip 压缩大小报告
			chunkSizeWarningLimit: 2000,
			// 模块预加载
			modulePreload: {
				polyfill: false,
				resolveDependencies: (filename: string, deps: string[], context: any) => {
					// 根据文件名过滤需要预加载的依赖
					return deps.filter((dep: any) => {
						// 只预加载核心chunks
						return dep.includes('chunk-core') || dep.includes('chunk-utils')
					})
				}
			},
			rollupOptions: {
				output: {
					// 分包策略
					manualChunks: {
						'chunk-core': ['vue', 'vue-router', 'pinia', 'vue-i18n', 'naive-ui'],
						'chunk-utils': ['@vueuse/core', 'radash', 'axios', 'qs'],
						'chunk-libs': ['dayjs', 'spark-md5', 'crypto-js'],
						'chunk-md': [
							'markdown-it',
							'markdown-it-link-attributes',
							'@traptitech/markdown-it-katex',
							'highlight.js'
						],
						'chunk-ai': ['@xenova/transformers']
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
