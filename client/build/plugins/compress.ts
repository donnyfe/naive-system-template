import compressPlugin from 'vite-plugin-compression'

/**
 * @title gzip压缩 (plugin: vite-plugin-compression)
 * @description Used to package and output gzip. Note that this does not work properly in Vite, the specific reason is still being investigated
 * @link https://github.com/anncwb/vite-plugin-compression
 */
export function useCompressPlugin(compress: 'gzip' | 'brotli', deleteOriginFile = false) {
	if (compress === 'gzip') {
		return compressPlugin({
			ext: '.gz',
			deleteOriginFile
		})
	}

	if (compress === 'brotli') {
		return compressPlugin({
			ext: '.br',
			algorithm: 'brotliCompress',
			deleteOriginFile
		})
	}
}
