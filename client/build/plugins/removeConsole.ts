import removeConsole from 'vite-plugin-remove-console'

// 线上环境删除console
export async function useRemoveConsolePlugin() {
	const removeConsolePlugin = removeConsole({
		// 排除文件的集合
		external: []
	})
	return removeConsolePlugin
}
