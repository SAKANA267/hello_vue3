/*
权限常量定义
定义所有系统权限和角色默认权限
*/

import type { UserRole } from '@/api/types'

/** 权限标识常量 */
export const PERMISSIONS = {
  // 页面级权限
  DASHBOARD_VIEW: 'dashboard:view',
  PROFILE_VIEW: 'profile:view',
  OBJECT_VIEW: 'object:view',
  OBJECT_CREATE: 'object:create',
  OBJECT_EDIT: 'object:edit',
  OBJECT_DELETE: 'object:delete',
  USER_VIEW: 'user:view',
  USER_MANAGE: 'user:manage',
  AUDIT_VIEW: 'audit:view',
  AUDIT_APPROVE: 'audit:approve',
  AUDIT_REJECT: 'audit:reject',
  TEST_VIEW: 'test:view',

  // 操作级权限
  DATA_EXPORT: 'data:export',
  DATA_IMPORT: 'data:import',
  AUDIT_BATCH: 'audit:batch',
  SYSTEM_CONFIG: 'system:config'
} as const

/** 权限值类型 */
export type PermissionValue = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

/** 角色默认权限映射 */
export const ROLE_PERMISSIONS: Record<UserRole, PermissionValue[]> = {
  super_admin: Object.values(PERMISSIONS),
  admin: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.OBJECT_VIEW,
    PERMISSIONS.OBJECT_CREATE,
    PERMISSIONS.OBJECT_EDIT,
    PERMISSIONS.OBJECT_DELETE,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.AUDIT_APPROVE,
    PERMISSIONS.AUDIT_REJECT,
    PERMISSIONS.DATA_EXPORT,
    PERMISSIONS.TEST_VIEW
  ],
  auditor: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.OBJECT_VIEW,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.AUDIT_APPROVE,
    PERMISSIONS.AUDIT_REJECT
  ],
  user: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.OBJECT_VIEW,
    PERMISSIONS.OBJECT_EDIT,
    PERMISSIONS.AUDIT_VIEW
  ],
  guest: [PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.PROFILE_VIEW, PERMISSIONS.OBJECT_VIEW]
}
