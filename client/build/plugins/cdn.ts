import { Plugin as importToCDN } from 'vite-plugin-cdn-import'

const libs = [
	// vue
	{ name: 'vue', var: 'Vue', path: 'vue.global.prod.min.js' },
	{ name: 'vue-router', var: 'VueRouter', path: 'vue-router.global.min.js' },
	{ name: 'vue-i18n', var: 'VueI18n', path: 'vue-i18n.runtime.global.prod.min.js' },
	// 项目中没有直接安装vue-demi，但是pinia用到了，所以需要在引入pinia前引入vue-demi（https://github.com/vuejs/pinia/blob/v2/packages/pinia/package.json#L77）
	{ name: 'vue-demi', var: 'VueDemi', path: 'index.iife.min.js' },
	{ name: 'pinia', var: 'Pinia', path: 'pinia.iife.min.js' },
	// ui
	{ name: 'element-plus', var: 'ElementPlus', path: 'index.full.min.js', css: 'index.min.css' },
	{ name: 'naive-ui', var: 'naive', path: 'index.prod.js' },
	// libs
	{ name: 'axios', var: 'axios', path: 'axios.min.js' },
	{ name: 'dayjs', var: 'dayjs', path: 'dayjs.min.js' },
	{ name: 'echarts', var: 'echarts', path: 'echarts.min.js' }
]

/**
 * CDN
 * 国内采用CDN：
 * https://www.bootcdn.cn
 * 其它方案：
 * https://cdnjs.cloudflare.com
 * https://unpkg.com
 * https://cdn.jsdelivr.net
 */
export function useCdnPlugin() {
	const useLibs = [
		// 核心框架库
		'vue',
		'vue-demi',
		'pinia',
		'vue-router',
		'vue-i18n',
		// UI 框架
		'naive-ui',
		// 工具库
		'axios'
	]
	const cdnConfig = {
		// 开发环境不启用 CDN
		enable: process.env.NODE_ENV === 'production',
		prodUrl: 'https://cdn.bootcdn.net/ajax/libs/{name}/{version}/{path}',
		modules: libs.filter((item) => useLibs.includes(item.name))
	}
	return importToCDN(cdnConfig)
}
