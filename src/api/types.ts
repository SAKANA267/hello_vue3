/*
统一 API 类型定义
*/

import type { AxiosRequestConfig } from 'axios'
import type { MockjsRequestOptions } from 'mockjs'

// ============== 基础类型 ==============

/** 统一 API 响应结构 */
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  msg: string
}

/** 请求配置扩展 */
export interface RequestConfig extends AxiosRequestConfig {
  mock?: boolean
}

/** 分页请求参数 */
export interface PageParams {
  keyWord?: string
  page?: number
  limit?: number
}

// ============== 用户/认证相关 ==============

/** 角色类型 */
export type UserRole = 'super_admin' | 'admin' | 'auditor' | 'user' | 'guest'

/** 权限类型 - 资源:操作 格式 */
export type Permission = `${string}:${string}`

/** 用户信息 */
export interface UserInfo {
  username: string
  role: string
  hobbies: string
  registerDate: string
  lastLoginDate: string
  loginLocation: string
}

/** 登录请求参数 */
export interface LoginRequest {
  username: string
  password: string
}

/** 登录用户信息 */
export interface LoginUser {
  id: string
  username: string
  role: UserRole
  permissions: Permission[]
  dataScope?: 'all' | 'department' | 'self'
}

/** 登录响应数据 */
export interface LoginResponseData {
  menuList: string[] // 保留向后兼容
  token: string
  user: LoginUser
}

/** 菜单响应 */
export type MenuResponse = ApiResponse<LoginResponseData>

// ========== RESTful API 新增类型 ==========

/** RESTful 分页参数 */
export interface RestfulPageParams {
  keyword?: string // 原 keyWord
  page?: number
  size?: number // 原 limit
  role?: string
  status?: string
  includeDeleted?: boolean
}

/** RESTful 分页响应数据 */
export interface RestfulPageResponse<T = unknown> {
  page: number
  size: number
  total: number // 原 count
  records: T[] // 原 list
}

/** 用户角色枚举 */
export type UserRoleEnum = 'SUPER_ADMIN' | 'ADMIN' | 'AUDITOR' | 'USER' | 'GUEST'

/** 用户状态枚举 */
export type UserStatusEnum = 'ACTIVE' | 'INACTIVE'

/** 创建用户请求 (RESTful) */
export interface CreateUserRequest {
  username: string
  password: string // 新增必填字段
  name: string
  email?: string
  phone?: string
  role?: UserRoleEnum
  status?: UserStatusEnum
  dataScope?: string
}

/** 更新用户请求 (RESTful) */
export interface UpdateUserRequest {
  name?: string
  email?: string
  phone?: string
  role?: UserRoleEnum
  status?: UserStatusEnum
  dataScope?: string
}

/** 用户DTO (RESTful response) */
export interface UserDTO {
  id: string
  username: string
  name: string
  email?: string
  phone?: string
  role: UserRoleEnum
  status: UserStatusEnum
  dataScope?: string
  createTime: string
  updateTime?: string
  lastLogin?: string
}

/** 修改密码请求 */
export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

/** 批量删除请求 */
export type BatchDeleteRequest = string[]

// ============== Mock 相关 ==============

/** Mock 配置类型 */
export interface MockConfig extends MockjsRequestOptions {
  url: string
  body: string
}

/** Mock 响应结构 */
export interface MockResponse<T = unknown> {
  code: number
  message?: string
  data?: T
}

/** 参数解析结果 */
export interface ParsedParams extends PageParams {
  [key: string]: unknown
}

// ============== 审核相关 ==============

/** 审核通过参数 */
export interface AuditPassParams {
  id: string
  auditor: string
  auditDate: string
  status: '已审核'
}

/** 审核不通过参数 */
export interface AuditRejectParams {
  id: string
  auditor: string
  auditDate: string
  status: '审核不通过'
  remark?: string
}

/** 审核响应 */
export interface AuditResponse {
  success: boolean
  msg?: string
}

/** 审核撤回参数 */
export interface AuditRevokeParams {
  id: string
  status: '待审核'
}

// ============== 报告卡相关 (RESTful) ==============

/** 报告卡性别枚举 (后端) */
export type ReportCardGenderEnum = 'MALE' | 'FEMALE'

/** 报告卡状态枚举 (后端) */
export type ReportCardStatusEnum = 'PENDING' | 'APPROVED' | 'REJECTED'

/** 报告卡DTO (RESTful) */
export interface ReportCardDTO {
  id: string
  hospitalArea: string
  department: string
  diagnosisName: string
  inpatientNo: string
  outpatientNo: string
  name: string
  gender: ReportCardGenderEnum
  age: number
  phone: string
  reportDoctor: string
  fillDate: string
  auditorId?: string
  auditor?: string
  remark?: string
  status: ReportCardStatusEnum
  createTime: string
  updateTime?: string
  auditDate?: string
}

/** 创建报告卡请求 */
export interface CreateReportCardRequest {
  hospitalArea: string
  department: string
  diagnosisName: string
  inpatientNo: string
  outpatientNo: string
  name: string
  gender: ReportCardGenderEnum
  age: number
  phone: string
  reportDoctor: string
  fillDate: string
}

/** 更新报告卡请求 (仅部分字段) */
export interface UpdateReportCardRequest {
  diagnosisName?: string
  phone?: string
  reportDoctor?: string
}

/** 审核请求 */
export interface ReportCardAuditRequest {
  auditorId: string
  remark?: string
}

/** 报告卡分页参数 */
export interface ReportCardPageParams {
  page?: number
  size?: number
  keyword?: string
  status?: ReportCardStatusEnum
  department?: string
  fillDateStart?: string
  fillDateEnd?: string
}
