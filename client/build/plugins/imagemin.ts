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
			optimizationLevel: 7
		},
		mozjpeg: {
			quality: 80
		},
		pngquant: {
			quality: [0.8, 0.9],
			speed: 4
		},
		svgo: {
			plugins: [
				{
					name: 'removeViewBox'
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
