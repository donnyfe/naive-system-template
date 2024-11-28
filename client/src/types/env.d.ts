type ServiceEnvType = 'dev' | 'prod'

interface ImportMetaEnv {
	/** 是否为生产环境 */
	readonly VITE_MODE: ServiceEnvType
	/** 项目标题 */
	readonly VITE_APP_NAME: string
	/** hash路由模式 */
	readonly VITE_ROUTE_MODE?: 'hash' | 'web'
	/** 首次加载页面 */
	readonly VITE_ROUTE_HOME_PATH: string
	/** 版权信息 */
	readonly VITE_COPYRIGHT_INFO: string
	/** 后端服务地址 */
	readonly VITE_AXIOS_BASE_URL: string
	/** 本地缓存前缀 */
	readonly VITE_STORAGE_PREFIX: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
