import viteImagemin from 'vite-plugin-imagemin'

/**
 * @title 图片压缩
 * @description Image resource files used to compress the output of the production environment
 * @link https://github.com/anncwb/vite-plugin-imagemin
 */
export function useImageminPlugin() {
	const imageminPlugin = viteImagemin({
		gifsicle: {
			optimizationLevel: 7,
			interlaced: false
		},
		optipng: {
			optimizationLevel: 5
		},
		mozjpeg: {
			quality: 75, // 适当降低质量
			progressive: true // 启用渐进式加载
		},
		pngquant: {
			quality: [0.7, 0.8], // 适当降低质量
			speed: 6 // 提高速度
		},
		svgo: {
			plugins: [
				{
					name: 'removeViewBox',
					active: false // 避免SVG显示问题
				},
				{
					name: 'removeEmptyAttrs',
					active: false
				}
			]
		}
	})
	return imageminPlugin
}
