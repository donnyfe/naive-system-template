type ServiceEnvType = 'dev' | 'test' | 'prod'

interface ImportMetaEnv {
	/** 项目基本地址 */
	readonly VITE_BASE_URL: string
	/** 项目标题 */
	readonly VITE_APP_NAME: string
	/** hash路由模式 */
	readonly VITE_ROUTE_MODE?: 'hash' | 'web'
	/** 路由加载模式 */
	readonly VITE_AUTH_ROUTE_MODE: 'static' | 'dynamic'
	/** 首次加载页面 */
	readonly VITE_HOME_PATH: string
	/** 版权信息 */
	readonly VITE_COPYRIGHT_INFO: string
	/** 后端服务的环境类型 */
	readonly MODE: ServiceEnvType
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
