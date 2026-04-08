/*
统一 API 类型定义 - 后端 API 对接版本
*/

import type { AxiosRequestConfig } from 'axios'

// ============== 基础类型 ==============

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

// ============== 后端认证相关 ==============

/** 后端统一响应格式 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  timestamp: string
}

/** 用户角色枚举 */
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'AUDITOR' | 'USER' | 'GUEST'

/** 用户信息 */
export interface UserInfo {
  id: string
  username: string
  name: string
  email: string
  role: UserRole
}

/** 登录请求 */
export interface LoginRequest {
  username: string
  password: string
}

/** 登录/注册响应 */
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  userInfo: UserInfo
}

/** 注册请求 */
export interface RegisterRequest {
  username: string
  password: string
  confirmPassword: string
  name: string
  email?: string
  phone?: string
}

/** 刷新令牌请求 */
export interface RefreshTokenRequest {
  refreshToken: string
}

/** 令牌验证响应 */
export interface ValidateTokenResponse {
  valid: boolean
}

// ============== RESTful 分页 ==============

/** RESTful 分页参数 */
export interface RestfulPageParams {
  keyword?: string
  page?: number
  size?: number
  role?: string
  status?: string
  includeDeleted?: boolean
}

/** RESTful 分页响应数据 */
export interface RestfulPageResponse<T = unknown> {
  page: number
  size: number
  total: number
  records: T[]
}

// ============== 用户管理 (RESTful) ==============

/** 用户状态枚举 */
export type UserStatusEnum = 'ACTIVE' | 'INACTIVE'

/** 创建用户请求 (RESTful) */
export interface CreateUserRequest {
  username: string
  password: string
  name: string
  email?: string
  phone?: string
  role?: UserRole
  status?: UserStatusEnum
  dataScope?: string
}

/** 更新用户请求 (RESTful) */
export interface UpdateUserRequest {
  name?: string
  email?: string
  phone?: string
  role?: UserRole
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
  role: UserRole
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

// ============== 报告卡相关 (RESTful) ==============

/** 报告卡性别枚举 (后端) */
export type ReportCardGenderEnum = 'MALE' | 'FEMALE'

/** 报告卡审核状态枚举 (后端) - 原 status */
export type ReportCardStatusEnum = 'PENDING' | 'APPROVED' | 'REJECTED'

/** 报告卡分配状态枚举 (后端) - 新增 */
export type ReportCardAssignStatusEnum = 'UNASSIGNED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'VOID'

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
  auditStatus: ReportCardStatusEnum // 原 status 改为 auditStatus
  assignStatus: ReportCardAssignStatusEnum // 新增分配状态
  assigneeId?: string // 新增分配的审核员ID
  assigneeName?: string // 新增分配的审核员姓名
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
  auditStatus?: ReportCardStatusEnum // 原 status 改为 auditStatus
  assignStatus?: ReportCardAssignStatusEnum // 新增分配状态筛选
  department?: string
  fillDateStart?: string
  fillDateEnd?: string
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

// ============== 权限类型 ==============

/** 权限类型 - 资源:操作 格式 */
export type Permission = `${string}:${string}`

/** 用户信息（兼容旧代码） */
export interface UserInfoLegacy {
  username: string
  role: string
  hobbies: string
  registerDate: string
  lastLoginDate: string
  loginLocation: string
}

// ============== 登录历史 (Login History) ==============

/** 登录状态枚举 */
export type LoginStatusEnum = 'SUCCESS' | 'FAILURE'

/** 登录历史DTO */
export interface LoginHistoryDTO {
  id: string
  userId: string
  username: string
  loginTime: string
  loginLocation?: string
  ipAddress: string
  userAgent: string
  status: LoginStatusEnum
  failReason?: string | null
}

/** 登录历史分页查询参数 */
export interface LoginHistoryPageParams {
  userId: string
  status?: LoginStatusEnum
  startTime?: string
  endTime?: string
  page?: number
  size?: number
}

/** 登录历史分页响应 */
export interface LoginHistoryPageResponse {
  total: number
  totalPages: number
  page: number
  size: number
  hasPrevious: boolean
  hasNext: boolean
  records: LoginHistoryDTO[]
}

// ============== Mock 相关 (保留以支持其他功能) ==============

import type { MockjsRequestOptions } from 'mockjs'

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

// ============== 审核组管理 (RESTful) ==============

/** 审核组状态枚举 */
export type AuditGroupStatusEnum = 'ACTIVE' | 'INACTIVE'

/** 审核组DTO */
export interface AuditGroupDTO {
  id: string
  groupName: string
  groupCode: string
  description?: string
  leaderId?: string
  leaderName?: string
  status: AuditGroupStatusEnum
  memberCount: number
  createTime: string
  updateTime?: string
}

/** 创建审核组请求 */
export interface CreateAuditGroupRequest {
  groupName: string
  groupCode: string
  description?: string
  leaderId?: string
  status?: AuditGroupStatusEnum
}

/** 更新审核组请求 */
export interface UpdateAuditGroupRequest {
  groupName?: string
  description?: string
  leaderId?: string
  status?: AuditGroupStatusEnum
}

/** 审核组分页参数 */
export interface AuditGroupPageParams {
  page?: number
  size?: number
  keyword?: string
  status?: AuditGroupStatusEnum
}

/** 审核组成员DTO */
export interface AuditGroupMemberDTO {
  userId: string
  username: string
  name: string
  email?: string
  phone?: string
  role: string
  status: string
  joinTime: string
}

/** 添加组成员请求 */
export interface AddGroupMembersRequest {
  groupId: string
  userIds: string[]
}

/** 移除组成员请求 */
export interface RemoveGroupMembersRequest {
  groupId: string
  userIds: string[]
}

/** 用户审核组信息DTO */
export interface UserAuditGroupDTO {
  groupId: string
  groupName: string
  groupCode: string
  description?: string
  status: AuditGroupStatusEnum
  isLeader: boolean
  joinTime: string
}

// ============== 任务分配 (Assignment) ==============

/** 任务状态枚举 */
export type AssignmentStatusEnum = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

/** 任务优先级枚举 */
export type AssignmentPriorityEnum = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'

/** 分配策略枚举 */
export type AssignStrategyEnum = 'ROUND_ROBIN' | 'LEAST_TASKS' | 'MANUAL' | 'LEADER'

/** 操作类型枚举 */
export type OperationTypeEnum = 'ASSIGN' | 'ACCEPT' | 'COMPLETE' | 'CANCEL' | 'REASSIGN'

/** 任务DTO */
export interface AssignmentDTO {
  id: string
  reportCardId: string
  auditGroupId: string
  auditGroupName: string
  assignerId?: string
  assignerName?: string
  accepterId?: string
  accepterName?: string
  status: AssignmentStatusEnum
  statusDescription: string
  priority: AssignmentPriorityEnum
  priorityDescription: string
  assignTime: string
  acceptTime?: string
  deadline?: string
  completeTime?: string
  remark?: string
  version: number
  // 报卡关联信息
  reportCardInpatientNo?: string
  reportCardPatientName?: string
  reportCardDiagnosisName?: string
}

/** 手动分配任务请求 */
export interface AssignTaskRequest {
  reportCardId: string
  auditGroupId: string
  priority?: AssignmentPriorityEnum
  deadline?: string
  remark?: string
}

/** 自动分配任务请求 */
export interface AutoAssignRequest {
  reportCardId: string
  diseaseCategory?: string
  hospitalArea?: string
  department?: string
  assignerId: string
}

/** 接受任务请求 */
export interface AcceptTaskRequest {
  assignmentId: string
  accepterId: string
}

/** 完成任务请求 */
export interface CompleteTaskRequest {
  assignmentId: string
  status: 'COMPLETED'
  remark?: string
  version: number
}

/** 取消任务请求 */
export interface CancelTaskRequest {
  assignmentId: string
  status: 'CANCELLED'
  remark?: string
  version: number
}

/** 重新分配任务请求 */
export interface ReassignTaskRequest {
  newAuditGroupId: string
  remark?: string
}

/** 任务分页参数 */
export interface AssignmentPageParams {
  page?: number
  size?: number
  status?: AssignmentStatusEnum
  priority?: AssignmentPriorityEnum
  auditGroupId?: string
  keyword?: string
}

// ============== 分配规则 (Assignment Rule) ==============

/** 规则状态枚举 */
export type RuleStatusEnum = 'ACTIVE' | 'INACTIVE'

/** 分配规则DTO */
export interface AssignmentRuleDTO {
  id: string
  ruleName: string
  ruleCode: string
  diseaseCategory?: string
  hospitalArea?: string
  department?: string
  assignStrategy: AssignStrategyEnum
  assignStrategyDescription: string
  targetGroupId?: string
  targetGroupName?: string
  priority: AssignmentPriorityEnum
  priorityDescription: string
  deadlineHours?: number
  status: RuleStatusEnum
  statusDescription: string
  ruleOrder: number
  createTime: string
  updateTime?: string
}

/** 创建分配规则请求 */
export interface CreateAssignmentRuleRequest {
  ruleName: string
  ruleCode: string
  diseaseCategory?: string
  hospitalArea?: string
  department?: string
  assignStrategy: AssignStrategyEnum
  targetGroupId?: string
  priority?: AssignmentPriorityEnum
  deadlineHours?: number
  status?: RuleStatusEnum
  ruleOrder?: number
}

/** 更新分配规则请求 */
export interface UpdateAssignmentRuleRequest {
  ruleName?: string
  diseaseCategory?: string
  hospitalArea?: string
  department?: string
  assignStrategy?: AssignStrategyEnum
  targetGroupId?: string
  priority?: AssignmentPriorityEnum
  deadlineHours?: number
  status?: RuleStatusEnum
  ruleOrder?: number
}

/** 规则分页参数 */
export interface AssignmentRulePageParams {
  page?: number
  size?: number
  status?: RuleStatusEnum
  keyword?: string
}

// ============== 工作统计 (Work Statistics) ==============

/** 工作统计DTO */
export interface WorkStatsDTO {
  id: string
  auditGroupId: string
  auditGroupName: string
  auditGroupCode: string
  totalAssigned: number
  totalCompleted: number
  totalCancelled: number
  pendingCount: number
  inProgressCount: number
  currentTaskCount: number
  avgProcessTime: number
  lastTaskTime: string
}

// ============== 操作日志 (Operation Log) ==============

/** 操作日志DTO */
export interface AssignmentLogDTO {
  id: string
  assignmentId: string
  reportCardId: string
  operationType: OperationTypeEnum
  operationTypeDescription: string
  operatorId: string
  operatorName: string
  beforeStatus?: string
  afterStatus: string
  createTime: string
}

/** 日志分页参数 */
export interface AssignmentLogPageParams {
  page?: number
  size?: number
  operationType?: OperationTypeEnum
}
