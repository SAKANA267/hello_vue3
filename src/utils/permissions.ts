/*
权限工具函数
提供权限检查的纯函数
*/

import type { Permission, UserRole } from '@/api/types'

/** 获取当前用户信息 */
function getCurrentUser() {
  const userInfo = localStorage.getItem('user_info')
  if (!userInfo) return null
  try {
    return JSON.parse(userInfo)
  } catch (e) {
    console.error('Failed to parse user info:', e)
    return null
  }
}

/**
 * 检查用户是否有指定权限
 * @param permission 权限标识
 * @returns 是否有权限
 */
export function hasPermission(permission: Permission): boolean {
  const user = getCurrentUser()
  if (!user) return false
  const userPermissions = user.permissions || []
  return userPermissions.includes(permission)
}

/**
 * 检查用户是否有指定角色
 * @param role 角色标识
 * @returns 是否是该角色
 */
export function hasRole(role: UserRole): boolean {
  const user = getCurrentUser()
  if (!user) return false
  return user.role === role
}

/**
 * 检查用户是否有任一权限
 * @param permissions 权限数组
 * @returns 是否有任一权限
 */
export function hasAnyPermission(permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(p))
}

/**
 * 检查用户是否有所有权限
 * @param permissions 权限数组
 * @returns 是否拥有所有权限
 */
export function hasAllPermissions(permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(p))
}

/**
 * 检查用户是否有任一角色
 * @param roles 角色数组
 * @returns 是否是任一角色
 */
export function hasAnyRole(roles: UserRole[]): boolean {
  return roles.some(r => hasRole(r))
}
