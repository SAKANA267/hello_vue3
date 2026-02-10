/*
权限 Composable
提供响应式的权限检查功能
*/

import { computed } from 'vue'
import { useAllDataStore } from '@/stores/index.js'
import {
  hasPermission,
  hasRole,
  hasAnyPermission,
  hasAllPermissions,
  hasAnyRole
} from '@/utils/permissions'
import type { Permission, UserRole } from '@/api/types'

/**
 * 权限 Composable
 * @returns 权限相关的响应式状态和方法
 */
export function usePermissions() {
  const store = useAllDataStore()

  /** 当前用户角色 */
  const userRole = computed<UserRole | undefined>(() => store.state.user?.role)

  /** 当前用户权限列表 */
  const userPermissions = computed<Permission[]>(() => store.state.user?.permissions || [])

  /** 数据范围 */
  const dataScope = computed<'all' | 'department' | 'self' | undefined>(
    () => store.state.user?.dataScope
  )

  /** 是否已登录 */
  const isAuthenticated = computed(() => !!store.state.token)

  /** 是否是超级管理员 */
  const isSuperAdmin = computed(() => userRole.value === 'SUPER_ADMIN')

  /** 是否是管理员 */
  const isAdmin = computed(() => userRole.value === 'ADMIN' || isSuperAdmin.value)

  return {
    userRole,
    userPermissions,
    dataScope,
    isAuthenticated,
    isSuperAdmin,
    isAdmin,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
    hasAnyRole
  }
}
