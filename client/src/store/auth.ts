import { useRouteStore } from './router'
import { useTabStore } from './tab'
import { router } from '@/router'
import { local } from '@/utils'
import type { Result } from '@/utils/request'
import { login as doLogin, register as doRegister, queryUserInfo } from '@/views/login/api'
import { LoginData, LoginParam } from '@/views/login/types'


interface AuthState {
  userInfo: any
  token: string
  permissions: string[]
}
export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => {
    return {
      userInfo: local.get('userInfo'),
      token: local.get('accessToken') || '',
      permissions: [],
    }
  },
  getters: {
    /** 是否登录 */
    isLogin(state) {
      return Boolean(state.token)
    },
  },
  actions: {
    // 注册
    register(username: string, password: string): Promise<Result<any>> {
      return new Promise(async (resolve) => {
        const res = await doRegister({ username, password })
        resolve(res)
      })
    },

    /* 用户登录 */
    async login(params: LoginParam) {
			const { success, data } = await doLogin(params)
			if (!success)
				return

			// 处理登录信息
			await this.handleLoginInfo(data)
    },

    /* 处理登录返回的数据 */
    async handleLoginInfo(loginData: LoginData) {
      // 记录token和用户信息
      local.set('accessToken', loginData.accessToken)
      this.token = loginData.accessToken

      const { success, data } = await queryUserInfo()
      if (!success)
        return

      this.userInfo = data
      local.set('userInfo', data)

      // 添加路由和菜单
      const routeStore = useRouteStore()
      await routeStore.initAuthRoute()

      // 进行重定向跳转
      const route = unref(router.currentRoute)
      const query = route.query as { redirect: string }
      router.push({
        path: query.redirect || '/',
      })
      window.$message.success('登录成功，欢迎您!')
    },

    /* 登录退出，重置用户信息等 */
    async logout() {
      const route = unref(router.currentRoute)
      // 清除本地缓存
      this.clearAuthStorage()
      // 清空路由、菜单等数据
      const routeStore = useRouteStore()
      routeStore.resetRouteStore()
      // 清空标签栏数据
      const tabStore = useTabStore()
      tabStore.clearAllTabs()
      // 重置当前存储库
      this.$reset()
      // 重定向到登录页
      if (route.meta.requiresAuth) {
        router.push({
          name: 'login',
          query: {
            redirect: route.fullPath,
          },
        })
      }
    },
    clearAuthStorage() {
      local.remove('accessToken')
      local.remove('refreshToken')
      local.remove('userInfo')
    },
  },
})
