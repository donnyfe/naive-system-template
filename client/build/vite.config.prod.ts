import { mergeConfig } from 'vite'
import { useCdnPlugin, useCompressPlugin, useImageminPlugin, useRemoveConsolePlugin, useVisualizerPlugin } from './plugins'
import baseConfig from './vite.config.base'

export default mergeConfig({
	mode: 'prod',
	base: './',
	plugins: [
		// 移除console
		useRemoveConsolePlugin,
		// 图片压缩
		useImageminPlugin(),
		// cdn
		useCdnPlugin(),
		// 打包压缩
		useCompressPlugin('gzip'),
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
				chunkFileNames: 'static/js/[name]-[hash].js',
				entryFileNames: 'static/js/[name]-[hash].js',
				assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
				manualChunks(id: string) {
					if (id.includes('node_modules')) {
						return id.toString().split('node_modules/')[1].split('/')[0].toString()
					}
				}
			}
		}
	}
}, baseConfig)
