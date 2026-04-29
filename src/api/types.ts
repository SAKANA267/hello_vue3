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

// ============== 报告卡相关 (v2 多表迁移版) ==============

/** 性别 */
export type Gender = 'MALE' | 'FEMALE'

/** 审核状态 */
export type AuditStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

/** 分配状态 */
export type AssignStatus = 'UNASSIGNED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'VOID'

/** 报卡类别 */
export type ReportCategory = 'INITIAL' | 'CORRECTION'

/** 上报状态 */
export type ReportStatus = 'REPORTED' | 'UNREPORTED'

/** 现住址类型 */
export type AddressType =
  | 'COUNTY'
  | 'CITY'
  | 'PROVINCE'
  | 'OTHER_PROVINCE'
  | 'HK_MACAO_TAIWAN'
  | 'FOREIGN'

/** 病人属于 */
export type PatientBelong = 'LOCAL' | 'NON_LOCAL'

/** 病例分类 */
export type CaseType = 'SUSPECTED' | 'CLINICAL' | 'CONFIRMED' | 'PATHOGEN'

/** 病例属性 */
export type CaseAttribute = 'ACUTE' | 'CHRONIC'

/** 向后兼容别名 */
export type ReportCardGenderEnum = Gender
export type ReportCardStatusEnum = AuditStatus
export type ReportCardAssignStatusEnum = AssignStatus

/** 患者信息DTO（嵌套在详情中） */
export interface PatientInfoDTO {
  id: string
  patientName: string
  idCard: string
  birthday: string | null
  gender: Gender | null
  age: number | null
  phone: string
  parentName: string | null
  workUnit: string | null
  addressType: AddressType | null
  detailAddress: string
}

/** 诊断信息DTO（嵌套在详情中） */
export interface DiagnosisInfoDTO {
  id: string
  diseaseName: string
  diagnosisCode: string | null
  patientBelong: PatientBelong | null
  crowdCategories: string[] | null
  caseType: CaseType | null
  caseAttribute: CaseAttribute | null
  onsetDate: string | null
  diagnosisDate: string
  deathDate: string | null
  remark: string | null
}

/** 审核信息DTO（嵌套在详情中） */
export interface AuditInfoDTO {
  id: string
  auditorId: string | null
  auditorName: string | null
  auditStatus: AuditStatus
  auditDate: string | null
  rejectReason: string | null
  assignStatus: AssignStatus
  assigneeId: string | null
}

/** 报告卡DTO（v2 列表 & 详情通用）
 * 列表查询时 patientInfo/diagnosisInfo/auditInfo 为 null；详情查询时填充
 */
export interface ReportCardDTO {
  id: string
  cardNumber: string | null
  reportCategory: ReportCategory | null
  reportStatus: ReportStatus | null
  hospitalArea: string
  department: string
  inpatientNo: string | null
  outpatientNo: string | null
  doctorName: string
  fillDate: string
  patientName: string
  diseaseName: string
  auditStatus: AuditStatus
  createTime: string
  updateTime: string

  /** 详情时有值，列表时为 null */
  patientInfo?: PatientInfoDTO | null
  diagnosisInfo?: DiagnosisInfoDTO | null
  auditInfo?: AuditInfoDTO | null
}

/** 创建报告卡请求 */
export interface CreateReportCardRequest {
  hospitalArea: string
  department: string
  inpatientNo?: string
  outpatientNo?: string
  doctorName: string
  fillDate: string
  cardNumber?: string
  reportCategory?: ReportCategory

  patientInfo: {
    patientName: string
    idCard: string
    birthday?: string
    gender?: Gender
    age?: number
    phone: string
    parentName?: string
    workUnit?: string
    addressType?: AddressType
    detailAddress: string
  }

  diagnosisInfo: {
    diseaseName: string
    diagnosisCode?: string
    patientBelong?: PatientBelong
    crowdCategories?: string[]
    caseType?: CaseType
    caseAttribute?: CaseAttribute
    onsetDate?: string
    diagnosisDate: string
    deathDate?: string
    remark?: string
  }
}

/** 更新报告卡请求（仅允许更新待审核状态） */
export interface UpdateReportCardRequest {
  cardNumber?: string
  reportCategory?: ReportCategory
  reportStatus?: ReportStatus
  doctorName?: string

  patientInfo?: {
    phone?: string
    birthday?: string
    gender?: Gender
    age?: number
    parentName?: string
    workUnit?: string
    addressType?: AddressType
    detailAddress?: string
  }

  diagnosisInfo?: {
    diseaseName?: string
    diagnosisCode?: string
    patientBelong?: PatientBelong
    crowdCategories?: string[]
    caseType?: CaseType
    caseAttribute?: CaseAttribute
    onsetDate?: string
    diagnosisDate?: string
    deathDate?: string
    remark?: string
  }
}

/** 审核请求 */
export interface ReportCardAuditRequest {
  auditorId: string
  remark?: string
}

/** 报告卡查询参数 (v2) */
export interface ReportCardQueryRequest {
  page?: number
  size?: number
  keyword?: string
  status?: AuditStatus
  assignStatus?: AssignStatus
  reportCategory?: ReportCategory
  reportStatus?: ReportStatus
  hospitalArea?: string
  department?: string
  auditorId?: string
  caseType?: CaseType
  startTime?: string
  endTime?: string
  includeDeleted?: boolean
}

/** @deprecated Use ReportCardQueryRequest instead */
export type ReportCardPageParams = ReportCardQueryRequest

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

// ============== 上报国家疾控中心 (CDC Upload) ==============

/** 上报状态枚举 */
export type UploadStatusEnum = 'NOT_UPLOADED' | 'UPLOADING' | 'UPLOADED' | 'UPLOAD_FAILED'

/** 上报DTO */
export interface CdcUploadDTO {
  id: string
  reportCardId: string
  hospitalArea: string
  department: string
  diseaseName: string
  inpatientNo: string | null
  outpatientNo: string | null
  patientName: string
  gender: Gender | null
  age: number | null
  phone: string
  doctorName: string
  fillDate: string
  auditorName: string | null
  auditDate: string | null
  uploadStatus: UploadStatusEnum
  uploadTime?: string
  uploadOperator?: string
  uploadOperatorName?: string
  failReason?: string
  retryCount: number
}

/** 上报请求 */
export interface CdcUploadRequest {
  reportCardIds: string[]
  operatorId: string
}

/** 上报分页参数 */
export interface CdcUploadPageParams {
  page?: number
  size?: number
  keyword?: string
  uploadStatus?: UploadStatusEnum
  department?: string
  fillDateStart?: string
  fillDateEnd?: string
}
