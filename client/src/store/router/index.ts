import type { MenuOption } from 'naive-ui'
import { createMenus, createRoutes, generateCacheRoutes } from './helper'
import { $t, local } from '@/utils'
import { router } from '@/router'
import { queryUserRoutes } from '@/views/login/api'
import { staticRoutes } from '@/router/static-routes'
import { useAuthStore } from '@/store/auth'

interface RoutesStatus {
  isInitAuthRoute: boolean
  menus: MenuOption[]
  rowRoutes: RowRoute[]
  activeMenu: string | null
  cacheRoutes: string[]
}
export const useRouteStore = defineStore('route-store', {
  state: (): RoutesStatus => {
    return {
      isInitAuthRoute: false,
      activeMenu: null,
      menus: [],
      rowRoutes: [],
      cacheRoutes: [],
    }
  },
  actions: {
    resetRouteStore() {
      this.resetRoutes()
      this.$reset()
    },
    resetRoutes() {
      if (router.hasRoute('appRoot'))
        router.removeRoute('appRoot')
    },
    // set the currently highlighted menu key
    setActiveMenu(key: string) {
      this.activeMenu = key
    },

    async getRoutes() {
      // 动态路由-从服务端获取路由数据
      if (import.meta.env.VITE_AUTH_ROUTE_MODE === 'dynamic') {
        const userInfo = local.get('userInfo')

        if (!userInfo || !userInfo.id) {
          const authStore = useAuthStore()
          authStore.logout()
          return
        }

        // Get user's route
        const { data } = await queryUserRoutes({
          id: userInfo.id,
        })
        if (!data)
          return

        return data
      }
      else {
        // 静态路由
        this.rowRoutes = staticRoutes
        return staticRoutes
      }
    },
    async initAuthRoute() {
      this.isInitAuthRoute = false

      // 获取路由
      const rowRoutes = await this.getRoutes()
      if (!rowRoutes) {
        window.$message.error($t(`app.getRouteError`))
        return
      }
      this.rowRoutes = rowRoutes

      // 生成路由
      const routes = createRoutes(rowRoutes)
      router.addRoute(routes)

      // 创建侧边栏菜单
			this.menus = createMenus(rowRoutes)

      // 缓存路由
      this.cacheRoutes = generateCacheRoutes(rowRoutes)

      this.isInitAuthRoute = true
    },
  },
})
