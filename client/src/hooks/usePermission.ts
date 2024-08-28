import { isArray, isString } from 'radash'
import { useAuthStore } from '@/store'

/** 权限判断 */
export function usePermission() {
  const authStore = useAuthStore()
  // 接收权限角色单个字符串或数组集合
  function hasPermission(permission: RoleCode | RoleCode[] | undefined) {
    if (!permission)
      return true

    if (!authStore.userInfo)
      return false

    const { role } = authStore.userInfo

    let has = role === 'super'
    if (!has) {
      if (isArray(permission))
        has = permission.includes(role)

      if (isString(permission))
        has = permission === role
    }
    return has
  }

  return {
    hasPermission,
  }
}
