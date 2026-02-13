/*
菜单角色配置
统一管理路由和侧边栏菜单的角色权限，保持一致性
*/

import type { UserRole } from '@/api/types'

/** 菜单项角色配置 */
export const MENU_ROLES: Record<string, UserRole[]> = {
  // 导航
  '1-1': ['SUPER_ADMIN', 'ADMIN', 'AUDITOR', 'USER'], // 对象管理
  '1-2': ['SUPER_ADMIN', 'ADMIN'], // 用户管理
  '1-3': ['SUPER_ADMIN', 'ADMIN', 'AUDITOR'], // 审核管理

  // 菜单
  '2-1': ['SUPER_ADMIN', 'ADMIN', 'AUDITOR', 'USER', 'GUEST'], // 首页
  '2-2': ['SUPER_ADMIN', 'ADMIN', 'AUDITOR', 'USER', 'GUEST'], // 个人资料
  '2-3': ['SUPER_ADMIN', 'ADMIN', 'AUDITOR', 'USER', 'GUEST'], // 登录历史

  // 文档
  '3-1': ['SUPER_ADMIN', 'ADMIN', 'AUDITOR', 'USER', 'GUEST'], // 快速开始
  '3-2': ['SUPER_ADMIN', 'ADMIN', 'AUDITOR', 'USER', 'GUEST'], // API 文档

  // 其他
  '4-1': ['SUPER_ADMIN', 'ADMIN'], // 设置
  '4-2': ['SUPER_ADMIN', 'ADMIN', 'AUDITOR', 'USER', 'GUEST'], // 帮助
  '4-3': ['SUPER_ADMIN', 'ADMIN'] // 测试页面
}

/** 根据菜单索引获取允许的角色列表 */
export function getMenuRoles(menuIndex: string): UserRole[] {
  return MENU_ROLES[menuIndex] || []
}

/** 检查用户角色是否有权限访问指定菜单 */
export function canAccessMenu(menuIndex: string, userRole: UserRole): boolean {
  const allowedRoles = getMenuRoles(menuIndex)
  return allowedRoles.includes(userRole)
}
