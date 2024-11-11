import { visualizer } from 'rollup-plugin-visualizer'
/**
 * @title 生成打包分析 (plugin: rollup-plugin-visualizer)
 * @description Generate packaging analysis
 * @link https://github.com/btd/rollup-plugin-visualizer
 */
export function useVisualizerPlugin() {
	return visualizer({
		filename: './node_modules/.cache/visualizer/stats.html',
		open: true,
		gzipSize: true,
		brotliSize: true
	})
}
