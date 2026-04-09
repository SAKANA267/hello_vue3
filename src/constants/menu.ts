/*
菜单角色配置
统一管理路由和侧边栏菜单的角色权限，保持一致性
*/

import type { UserRole } from '@/api/types'

/** 菜单项角色配置 */
export const MENU_ROLES: Record<string, UserRole[]> = {
  // 数据管理
  '1-1': ['SUPER_ADMIN', 'ADMIN', 'AUDITOR', 'USER'], // 对象管理
  '1-2': ['SUPER_ADMIN', 'ADMIN'], // 疾病分类管理
  '1-3': ['SUPER_ADMIN', 'ADMIN'], // 疾病种类管理

  // 系统管理
  '2-1': ['SUPER_ADMIN', 'ADMIN'], // 用户管理
  '2-2': ['SUPER_ADMIN', 'ADMIN'], // 审核组管理
  '2-3': ['SUPER_ADMIN', 'ADMIN'], // 分配规则管理
  '2-4': ['SUPER_ADMIN', 'ADMIN'], // 设置
  '2-5': ['SUPER_ADMIN', 'ADMIN'], // 测试页面

  // 审核中心
  '3-1': ['SUPER_ADMIN', 'ADMIN', 'AUDITOR'], // 审核管理
  '3-2': ['SUPER_ADMIN', 'ADMIN', 'AUDITOR'], // 任务管理
  '3-3': ['SUPER_ADMIN', 'ADMIN', 'AUDITOR'], // 工作统计

  // 个人与帮助
  '4-1': ['SUPER_ADMIN', 'ADMIN', 'AUDITOR', 'USER', 'GUEST'], // 首页
  '4-2': ['SUPER_ADMIN', 'ADMIN', 'AUDITOR', 'USER', 'GUEST'], // 个人资料
  '4-3': ['SUPER_ADMIN', 'ADMIN', 'AUDITOR', 'USER', 'GUEST'], // 登录历史
  '4-4': ['SUPER_ADMIN', 'ADMIN', 'AUDITOR', 'USER', 'GUEST'], // 快速开始
  '4-5': ['SUPER_ADMIN', 'ADMIN', 'AUDITOR', 'USER', 'GUEST'], // API 文档
  '4-6': ['SUPER_ADMIN', 'ADMIN', 'AUDITOR', 'USER', 'GUEST'], // 帮助
  '4-7': ['SUPER_ADMIN', 'ADMIN', 'AUDITOR', 'USER'] // AI 助手
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
