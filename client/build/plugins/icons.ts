import { resolve } from 'node:path'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'

export function useIconsPlugin() {
	// auto import iconify's icons
	return Icons({
		defaultStyle: 'display:inline-block',
		compiler: 'vue3',
		customCollections: {
			'svg-icons': FileSystemIconLoader(resolve('src/assets/svg-icons'), svg =>
				svg.replace(
					/^<svg /,
					'<svg fill="currentColor" width="1.2em" height="1.2em"'
				))
		}
	})
}
