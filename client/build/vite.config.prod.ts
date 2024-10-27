import { mergeConfig } from 'vite'
import { useImageminPlugin, useRemoveConsolePlugin, useVisualizerPlugin } from './plugins'
import baseConfig from './vite.config.base'

export default mergeConfig(
	{
		mode: 'prod',
		base: './',
		plugins: [
			// 移除console
			useRemoveConsolePlugin,
			// 图片压缩
			useImageminPlugin(),
			// 分析报告
			useVisualizerPlugin()
		],
		build: {
			target: 'esnext',
			sourcemap: true,
			reportCompressedSize: false, // 启用/禁用 gzip 压缩大小报告
			chunkSizeWarningLimit: 2000,

			rollupOptions: {
				output: {
					// 分包策略
					manualChunks: {
						// 将 Vue 相关库打包到 vue.js
						'chunk-vue': ['vue', 'vue-router', 'pinia'],
						// 将 naive-ui 单独打包
						'chunk-naive': ['naive-ui'],
						// 工具库打包到 utils.js
						'chunk-utils': ['@vueuse/core', 'radash', 'axios', 'qs', 'dayjs', 'spark-md5']
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
