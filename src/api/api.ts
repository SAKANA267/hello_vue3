/*
项目统一API管理 - 后端 API 对接版本
*/

import request from './request'
import type {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  AuthResponse,
  // RESTful types
  RestfulPageParams,
  RestfulPageResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserDTO,
  ChangePasswordRequest,
  // ReportCard types
  ReportCardDTO,
  CreateReportCardRequest,
  UpdateReportCardRequest,
  ReportCardAuditRequest,
  ReportCardPageParams,
  // LoginHistory types
  LoginHistoryDTO,
  LoginHistoryPageParams,
  LoginHistoryPageResponse,
  // AuditGroup types
  AuditGroupDTO,
  CreateAuditGroupRequest,
  UpdateAuditGroupRequest,
  AuditGroupPageParams,
  AuditGroupMemberDTO,
  AddGroupMembersRequest,
  RemoveGroupMembersRequest,
  // Assignment types
  AssignmentDTO,
  AssignTaskRequest,
  AutoAssignRequest,
  AcceptTaskRequest,
  CompleteTaskRequest,
  CancelTaskRequest,
  ReassignTaskRequest,
  AssignmentPageParams,
  // AssignmentRule types
  AssignmentRuleDTO,
  CreateAssignmentRuleRequest,
  UpdateAssignmentRuleRequest,
  AssignmentRulePageParams,
  // WorkStats types
  WorkStatsDTO,
  // AssignmentLog types
  AssignmentLogDTO,
  AssignmentLogPageParams
} from './types'

// ============== 认证 API ==============

/** 认证 API */
export const authApi = {
  /** 登录 */
  login(data: LoginRequest): Promise<AuthResponse> {
    return request({
      url: '/auth/login',
      method: 'post',
      data
    })
  },

  /** 注册 */
  register(data: RegisterRequest): Promise<AuthResponse> {
    return request({
      url: '/auth/register',
      method: 'post',
      data
    })
  },

  /** 刷新令牌 */
  refreshToken(data: RefreshTokenRequest): Promise<AuthResponse> {
    return request({
      url: '/auth/refresh',
      method: 'post',
      data
    })
  },

  /** 登出 */
  logout(): Promise<{ message: string }> {
    return request({
      url: '/auth/logout',
      method: 'post'
    })
  },

  /** 验证令牌 */
  validateToken(): Promise<boolean> {
    return request({
      url: '/auth/validate',
      method: 'get'
    })
  },

  /** 分页查询登录历史 */
  getLoginHistory(
    params: LoginHistoryPageParams
  ): Promise<{ code: number; message: string; data: LoginHistoryPageResponse; timestamp: string }> {
    return request({
      url: '/login-history',
      method: 'get',
      params
    })
  },

  /** 删除用户登录历史 */
  deleteUserLoginHistory(
    userId: string
  ): Promise<{ code: number; message: string; data: number; timestamp: string }> {
    return request({
      url: `/login-history/user/${userId}`,
      method: 'delete'
    })
  }
}

// ============== RESTful User Management API ==============

/** 用户管理 API */
export const userApi = {
  /** 分页查询用户列表 (RESTful) */
  getUsers(params?: RestfulPageParams): Promise<RestfulPageResponse<UserDTO>> {
    return request({
      url: '/users',
      method: 'get',
      params
    })
  },

  /** 根据ID获取用户 (RESTful) */
  getUserById(id: string): Promise<UserDTO> {
    return request({
      url: `/users/${id}`,
      method: 'get'
    })
  },

  /** 创建用户 (RESTful) */
  createUser(data: CreateUserRequest): Promise<UserDTO> {
    return request({
      url: '/users',
      method: 'post',
      data
    })
  },

  /** 更新用户 (RESTful) */
  updateUser(id: string, data: UpdateUserRequest): Promise<UserDTO> {
    return request({
      url: `/users/${id}`,
      method: 'put',
      data
    })
  },

  /** 删除用户 (RESTful) */
  deleteUser(id: string): Promise<{ message: string }> {
    return request({
      url: `/users/${id}`,
      method: 'delete'
    })
  },

  /** 批量删除用户 (RESTful) */
  batchDeleteUsers(ids: string[]): Promise<{ message: string }> {
    return request({
      url: '/users/batch',
      method: 'delete',
      data: ids
    })
  },

  /** 搜索用户 (RESTful) */
  searchUsers(keyword: string): Promise<UserDTO[]> {
    return request({
      url: '/users/search',
      method: 'get',
      params: { keyword }
    })
  },

  /** 启用用户 (RESTful) */
  activateUser(id: string): Promise<{ message: string }> {
    return request({
      url: `/users/${id}/activate`,
      method: 'put'
    })
  },

  /** 停用用户 (RESTful) */
  deactivateUser(id: string): Promise<{ message: string }> {
    return request({
      url: `/users/${id}/deactivate`,
      method: 'put'
    })
  },

  /** 修改密码 (RESTful) */
  changePassword(id: string, data: ChangePasswordRequest): Promise<{ message: string }> {
    return request({
      url: `/users/${id}/password`,
      method: 'put',
      data
    })
  },

  /** 检查用户名是否存在 (RESTful) */
  checkUsernameExists(username: string, excludeId?: string): Promise<boolean> {
    return request({
      url: '/users/check/username',
      method: 'get',
      params: { username, excludeId }
    })
  }
}

// ============== RESTful ReportCard Management API ==============

/** 报告卡管理 API */
export const reportCardApi = {
  /** 分页查询报告卡列表 (RESTful) */
  getReportCards(params?: ReportCardPageParams): Promise<RestfulPageResponse<ReportCardDTO>> {
    return request({
      url: '/report-cards',
      method: 'get',
      params
    })
  },

  /** 根据ID获取报告卡 (RESTful) */
  getReportCardById(id: string): Promise<ReportCardDTO> {
    return request({
      url: `/report-cards/${id}`,
      method: 'get'
    })
  },

  /** 创建报告卡 (RESTful) */
  createReportCard(data: CreateReportCardRequest): Promise<ReportCardDTO> {
    return request({
      url: '/report-cards',
      method: 'post',
      data
    })
  },

  /** 更新报告卡 (RESTful) */
  updateReportCard(id: string, data: UpdateReportCardRequest): Promise<ReportCardDTO> {
    return request({
      url: `/report-cards/${id}`,
      method: 'put',
      data
    })
  },

  /** 删除报告卡 (RESTful) */
  deleteReportCard(id: string): Promise<{ message: string }> {
    return request({
      url: `/report-cards/${id}`,
      method: 'delete'
    })
  },

  /** 审核通过报告卡 (RESTful) */
  approveReportCard(id: string, data: ReportCardAuditRequest): Promise<{ message: string }> {
    return request({
      url: `/report-cards/${id}/approve`,
      method: 'put',
      data
    })
  },

  /** 审核拒绝报告卡 (RESTful) */
  rejectReportCard(id: string, data: ReportCardAuditRequest): Promise<{ message: string }> {
    return request({
      url: `/report-cards/${id}/reject`,
      method: 'put',
      data
    })
  },

  /** 撤回报告卡审核 (RESTful) */
  withdrawReportCard(id: string): Promise<{ message: string }> {
    return request({
      url: `/report-cards/${id}/withdraw`,
      method: 'put'
    })
  },

  /** 获取待审核报告卡列表 (RESTful) */
  getPendingReportCards(): Promise<ReportCardDTO[]> {
    return request({
      url: '/report-cards/pending',
      method: 'get'
    })
  },

  /** 获取报告卡统计信息 (RESTful) */
  getReportCardStatistics(): Promise<{ PENDING: number; APPROVED: number; REJECTED: number }> {
    return request({
      url: '/report-cards/statistics',
      method: 'get'
    })
  },

  /** 获取未分配的报告卡列表 (用于任务分配) */
  getUnassignedReportCards(params?: {
    page?: number
    size?: number
    keyword?: string
    diseaseCategory?: string
    hospitalArea?: string
    department?: string
  }): Promise<RestfulPageResponse<ReportCardDTO>> {
    return request({
      url: '/report-cards/unassigned',
      method: 'get',
      params
    })
  },

  /** 根据分配状态查询报告卡列表 (新增) */
  getReportCardsByAssignStatus(assignStatus: string, params?: Omit<ReportCardPageParams, 'assignStatus'>): Promise<RestfulPageResponse<ReportCardDTO>> {
    return request({
      url: `/report-cards/assign-status/${assignStatus}`,
      method: 'get',
      params
    })
  }
}

// ============== RESTful AuditGroup Management API ==============

/** 审核组管理 API */
export const auditGroupApi = {
  /** 分页查询审核组列表 */
  getAuditGroups(params?: AuditGroupPageParams): Promise<RestfulPageResponse<AuditGroupDTO>> {
    return request({
      url: '/audit-groups',
      method: 'get',
      params
    })
  },

  /** 根据ID获取审核组 */
  getAuditGroupById(id: string): Promise<AuditGroupDTO> {
    return request({
      url: `/audit-groups/${id}`,
      method: 'get'
    })
  },

  /** 创建审核组 */
  createAuditGroup(data: CreateAuditGroupRequest): Promise<AuditGroupDTO> {
    return request({
      url: '/audit-groups',
      method: 'post',
      data
    })
  },

  /** 更新审核组 */
  updateAuditGroup(id: string, data: UpdateAuditGroupRequest): Promise<AuditGroupDTO> {
    return request({
      url: `/audit-groups/${id}`,
      method: 'put',
      data
    })
  },

  /** 删除审核组 */
  deleteAuditGroup(id: string): Promise<{ message: string }> {
    return request({
      url: `/audit-groups/${id}`,
      method: 'delete'
    })
  },

  /** 启用审核组 */
  activateAuditGroup(id: string): Promise<{ message: string }> {
    return request({
      url: `/audit-groups/${id}/activate`,
      method: 'put'
    })
  },

  /** 停用审核组 */
  deactivateAuditGroup(id: string): Promise<{ message: string }> {
    return request({
      url: `/audit-groups/${id}/deactivate`,
      method: 'put'
    })
  },

  /** 搜索审核组 */
  searchAuditGroups(keyword: string): Promise<AuditGroupDTO[]> {
    return request({
      url: '/audit-groups/search',
      method: 'get',
      params: { keyword }
    })
  },

  /** 获取所有启用的审核组 */
  getActiveAuditGroups(): Promise<AuditGroupDTO[]> {
    return request({
      url: '/audit-groups/active',
      method: 'get'
    })
  },

  /** 获取审核组成员 */
  getAuditGroupMembers(id: string): Promise<AuditGroupMemberDTO[]> {
    return request({
      url: `/audit-groups/${id}/members`,
      method: 'get'
    })
  },

  /** 添加组成员 */
  addGroupMembers(data: AddGroupMembersRequest): Promise<{ message: string }> {
    return request({
      url: '/audit-groups/members/add',
      method: 'post',
      data
    })
  },

  /** 移除组成员 */
  removeGroupMembers(data: RemoveGroupMembersRequest): Promise<{ message: string }> {
    return request({
      url: '/audit-groups/members/remove',
      method: 'post',
      data
    })
  },

  /** 设置审核组组长 */
  setAuditGroupLeader(id: string, leaderId: string): Promise<{ message: string }> {
    return request({
      url: `/audit-groups/${id}/leader`,
      method: 'put',
      params: { leaderId }
    })
  },

  /** 检查组名是否存在 */
  checkGroupNameExists(groupName: string, excludeId?: string): Promise<boolean> {
    return request({
      url: '/audit-groups/check/name',
      method: 'get',
      params: { groupName, excludeId }
    })
  },

  /** 检查组编码是否存在 */
  checkGroupCodeExists(groupCode: string, excludeId?: string): Promise<boolean> {
    return request({
      url: '/audit-groups/check/code',
      method: 'get',
      params: { groupCode, excludeId }
    })
  }
}

// ============== Task Assignment Management API ==============

/** 任务分配 API */
export const assignmentApi = {
  /** 手动分配任务 */
  assignTask(data: AssignTaskRequest): Promise<AssignmentDTO> {
    return request({
      url: '/assignments/assign',
      method: 'post',
      data
    })
  },

  /** 自动分配任务 */
  autoAssign(data: AutoAssignRequest): Promise<AssignmentDTO> {
    return request({
      url: '/assignments/auto-assign',
      method: 'post',
      data
    })
  },

  /** 接受任务 */
  acceptTask(data: AcceptTaskRequest): Promise<AssignmentDTO> {
    return request({
      url: `/assignments/${data.assignmentId}/accept`,
      method: 'post',
      data
    })
  },

  /** 完成任务 */
  completeTask(data: CompleteTaskRequest): Promise<AssignmentDTO> {
    return request({
      url: '/assignments/complete',
      method: 'post',
      data
    })
  },

  /** 取消任务 */
  cancelTask(data: CancelTaskRequest): Promise<AssignmentDTO> {
    return request({
      url: '/assignments/cancel',
      method: 'post',
      data
    })
  },

  /** 重新分配任务 */
  reassignTask(assignmentId: string, data: ReassignTaskRequest): Promise<AssignmentDTO> {
    return request({
      url: `/assignments/${assignmentId}/reassign`,
      method: 'post',
      params: { newAuditGroupId: data.newAuditGroupId },
      data
    })
  },

  /** 查询任务详情 */
  getAssignmentById(assignmentId: string): Promise<AssignmentDTO> {
    return request({
      url: `/assignments/${assignmentId}`,
      method: 'get'
    })
  },

  /** 查询审核组任务列表 */
  getGroupAssignments(auditGroupId: string, params?: AssignmentPageParams): Promise<RestfulPageResponse<AssignmentDTO>> {
    return request({
      url: `/assignments/group/${auditGroupId}`,
      method: 'get',
      params
    })
  },

  /** 查询待处理任务 */
  getPendingAssignments(params?: AssignmentPageParams): Promise<RestfulPageResponse<AssignmentDTO>> {
    return request({
      url: '/assignments/pending',
      method: 'get',
      params
    })
  },

  /** 查询即将超时任务 */
  getOverdueAssignments(): Promise<AssignmentDTO[]> {
    return request({
      url: '/assignments/overdue',
      method: 'get'
    })
  },

  /** 查询报卡分配记录 */
  getReportCardAssignments(reportCardId: string): Promise<AssignmentDTO[]> {
    return request({
      url: `/assignments/report-card/${reportCardId}`,
      method: 'get'
    })
  },

  /** 查询操作日志 */
  getAssignmentLogs(assignmentId: string, params?: AssignmentLogPageParams): Promise<RestfulPageResponse<AssignmentLogDTO>> {
    return request({
      url: `/assignments/${assignmentId}/logs`,
      method: 'get',
      params
    })
  }
}

// ============== Assignment Rule Management API ==============

/** 分配规则 API */
export const assignmentRuleApi = {
  /** 创建分配规则 */
  createRule(data: CreateAssignmentRuleRequest): Promise<AssignmentRuleDTO> {
    return request({
      url: '/assignment-rules',
      method: 'post',
      data
    })
  },

  /** 更新分配规则 */
  updateRule(ruleId: string, data: UpdateAssignmentRuleRequest): Promise<AssignmentRuleDTO> {
    return request({
      url: `/assignment-rules/${ruleId}`,
      method: 'put',
      data
    })
  },

  /** 删除分配规则 */
  deleteRule(ruleId: string): Promise<{ message: string }> {
    return request({
      url: `/assignment-rules/${ruleId}`,
      method: 'delete'
    })
  },

  /** 查询规则详情 */
  getRuleById(ruleId: string): Promise<AssignmentRuleDTO> {
    return request({
      url: `/assignment-rules/${ruleId}`,
      method: 'get'
    })
  },

  /** 查询所有规则 */
  getRules(params?: AssignmentRulePageParams): Promise<RestfulPageResponse<AssignmentRuleDTO>> {
    return request({
      url: '/assignment-rules',
      method: 'get',
      params
    })
  },

  /** 查询启用的规则 */
  getActiveRules(): Promise<AssignmentRuleDTO[]> {
    return request({
      url: '/assignment-rules/active',
      method: 'get'
    })
  },

  /** 启用/停用规则 */
  toggleRule(ruleId: string): Promise<AssignmentRuleDTO> {
    return request({
      url: `/assignment-rules/${ruleId}/toggle`,
      method: 'post'
    })
  }
}

// ============== Work Statistics API ==============

/** 工作统计 API */
export const workStatsApi = {
  /** 获取审核组工作统计 */
  getGroupWorkStats(auditGroupId: string): Promise<WorkStatsDTO> {
    return request({
      url: `/work-stats/group/${auditGroupId}`,
      method: 'get'
    })
  },

  /** 获取所有审核组统计 */
  getAllWorkStats(): Promise<WorkStatsDTO[]> {
    return request({
      url: '/work-stats/all',
      method: 'get'
    })
  },

  /** 获取任务最少的审核组 */
  getLeastLoadedGroup(): Promise<string> {
    return request({
      url: '/work-stats/least-loaded',
      method: 'get'
    })
  }
}

// ============== 通用 API (兼容旧代码) ==============

/** API 接口对象 */
interface ApiInterface {
  // user info
  getUserInfo(): Promise<any>
  getLoginInfo(): Promise<any>

  // login (兼容旧代码)
  getMenu(params: LoginRequest): Promise<any>
  register(params: RegisterRequest): Promise<any>

  // User Management
  getUsers(params?: RestfulPageParams): Promise<RestfulPageResponse<UserDTO>>
  getUserById(id: string): Promise<UserDTO>
  createUserRestful(data: CreateUserRequest): Promise<UserDTO>
  updateUserRestful(id: string, data: UpdateUserRequest): Promise<UserDTO>
  deleteUserRestful(id: string): Promise<{ message: string }>
  batchDeleteUsers(ids: string[]): Promise<{ message: string }>
  searchUsers(keyword: string): Promise<UserDTO[]>
  activateUser(id: string): Promise<{ message: string }>
  deactivateUser(id: string): Promise<{ message: string }>
  changePassword(id: string, data: ChangePasswordRequest): Promise<{ message: string }>
  checkUsernameExists(username: string, excludeId?: string): Promise<boolean>

  // ReportCard Management
  getReportCards(params?: ReportCardPageParams): Promise<RestfulPageResponse<ReportCardDTO>>
  getReportCardById(id: string): Promise<ReportCardDTO>
  createReportCard(data: CreateReportCardRequest): Promise<ReportCardDTO>
  updateReportCard(id: string, data: UpdateReportCardRequest): Promise<ReportCardDTO>
  deleteReportCard(id: string): Promise<{ message: string }>
  approveReportCard(id: string, data: ReportCardAuditRequest): Promise<{ message: string }>
  rejectReportCard(id: string, data: ReportCardAuditRequest): Promise<{ message: string }>
  withdrawReportCard(id: string): Promise<{ message: string }>
  getPendingReportCards(): Promise<ReportCardDTO[]>
  getReportCardStatistics(): Promise<{ PENDING: number; APPROVED: number; REJECTED: number }>
  getUnassignedReportCards(params?: {
    page?: number
    size?: number
    keyword?: string
    diseaseCategory?: string
    hospitalArea?: string
    department?: string
  }): Promise<RestfulPageResponse<ReportCardDTO>>
  getReportCardsByAssignStatus(assignStatus: string, params?: Omit<ReportCardPageParams, 'assignStatus'>): Promise<RestfulPageResponse<ReportCardDTO>>

  // LoginHistory Management
  getLoginHistory(
    params: LoginHistoryPageParams
  ): Promise<{ code: number; message: string; data: LoginHistoryPageResponse; timestamp: string }>
  deleteUserLoginHistory(
    userId: string
  ): Promise<{ code: number; message: string; data: number; timestamp: string }>

  // AuditGroup Management
  getAuditGroups(params?: AuditGroupPageParams): Promise<RestfulPageResponse<AuditGroupDTO>>
  getAuditGroupById(id: string): Promise<AuditGroupDTO>
  createAuditGroup(data: CreateAuditGroupRequest): Promise<AuditGroupDTO>
  updateAuditGroup(id: string, data: UpdateAuditGroupRequest): Promise<AuditGroupDTO>
  deleteAuditGroup(id: string): Promise<{ message: string }>
  activateAuditGroup(id: string): Promise<{ message: string }>
  deactivateAuditGroup(id: string): Promise<{ message: string }>
  searchAuditGroups(keyword: string): Promise<AuditGroupDTO[]>
  getActiveAuditGroups(): Promise<AuditGroupDTO[]>
  getAuditGroupMembers(id: string): Promise<AuditGroupMemberDTO[]>
  addGroupMembers(data: AddGroupMembersRequest): Promise<{ message: string }>
  removeGroupMembers(data: RemoveGroupMembersRequest): Promise<{ message: string }>
  setAuditGroupLeader(id: string, leaderId: string): Promise<{ message: string }>
  checkGroupNameExists(groupName: string, excludeId?: string): Promise<boolean>
  checkGroupCodeExists(groupCode: string, excludeId?: string): Promise<boolean>

  // Assignment Management
  assignTask(data: AssignTaskRequest): Promise<AssignmentDTO>
  autoAssign(data: AutoAssignRequest): Promise<AssignmentDTO>
  acceptTask(data: AcceptTaskRequest): Promise<AssignmentDTO>
  completeTask(data: CompleteTaskRequest): Promise<AssignmentDTO>
  cancelTask(data: CancelTaskRequest): Promise<AssignmentDTO>
  reassignTask(assignmentId: string, data: ReassignTaskRequest): Promise<AssignmentDTO>
  getAssignmentById(assignmentId: string): Promise<AssignmentDTO>
  getGroupAssignments(auditGroupId: string, params?: AssignmentPageParams): Promise<RestfulPageResponse<AssignmentDTO>>
  getPendingAssignments(params?: AssignmentPageParams): Promise<RestfulPageResponse<AssignmentDTO>>
  getOverdueAssignments(): Promise<AssignmentDTO[]>
  getReportCardAssignments(reportCardId: string): Promise<AssignmentDTO[]>
  getAssignmentLogs(assignmentId: string, params?: AssignmentLogPageParams): Promise<RestfulPageResponse<AssignmentLogDTO>>

  // AssignmentRule Management
  createAssignmentRule(data: CreateAssignmentRuleRequest): Promise<AssignmentRuleDTO>
  updateAssignmentRule(ruleId: string, data: UpdateAssignmentRuleRequest): Promise<AssignmentRuleDTO>
  deleteAssignmentRule(ruleId: string): Promise<{ message: string }>
  getAssignmentRuleById(ruleId: string): Promise<AssignmentRuleDTO>
  getAssignmentRules(params?: AssignmentRulePageParams): Promise<RestfulPageResponse<AssignmentRuleDTO>>
  getActiveAssignmentRules(): Promise<AssignmentRuleDTO[]>
  toggleAssignmentRule(ruleId: string): Promise<AssignmentRuleDTO>

  // WorkStats Management
  getGroupWorkStats(auditGroupId: string): Promise<WorkStatsDTO>
  getAllWorkStats(): Promise<WorkStatsDTO[]>
  getLeastLoadedGroup(): Promise<string>
}

/** 通用 API 对象 (兼容旧代码，内部调用新的 authApi/userApi/reportCardApi) */
const api: ApiInterface = {
  // ========== user info ==========
  getUserInfo() {
    return request({
      url: '/user/getUserInfo',
      method: 'get'
    })
  },

  getLoginInfo() {
    return request({
      url: '/user/getLoginInfo',
      method: 'get'
    })
  },

  // ========== login (兼容旧代码) ==========
  getMenu(params: LoginRequest) {
    return authApi.login(params)
  },

  register(params: RegisterRequest) {
    return authApi.register(params)
  },

  // ========== User Management ==========
  getUsers(params?: RestfulPageParams) {
    return userApi.getUsers(params)
  },

  getUserById(id: string) {
    return userApi.getUserById(id)
  },

  createUserRestful(data: CreateUserRequest) {
    return userApi.createUser(data)
  },

  updateUserRestful(id: string, data: UpdateUserRequest) {
    return userApi.updateUser(id, data)
  },

  deleteUserRestful(id: string) {
    return userApi.deleteUser(id)
  },

  batchDeleteUsers(ids: string[]) {
    return userApi.batchDeleteUsers(ids)
  },

  searchUsers(keyword: string) {
    return userApi.searchUsers(keyword)
  },

  activateUser(id: string) {
    return userApi.activateUser(id)
  },

  deactivateUser(id: string) {
    return userApi.deactivateUser(id)
  },

  changePassword(id: string, data: ChangePasswordRequest) {
    return userApi.changePassword(id, data)
  },

  checkUsernameExists(username: string, excludeId?: string) {
    return userApi.checkUsernameExists(username, excludeId)
  },

  // ========== ReportCard Management ==========
  getReportCards(params?: ReportCardPageParams) {
    return reportCardApi.getReportCards(params)
  },

  getReportCardById(id: string) {
    return reportCardApi.getReportCardById(id)
  },

  createReportCard(data: CreateReportCardRequest) {
    return reportCardApi.createReportCard(data)
  },

  updateReportCard(id: string, data: UpdateReportCardRequest) {
    return reportCardApi.updateReportCard(id, data)
  },

  deleteReportCard(id: string) {
    return reportCardApi.deleteReportCard(id)
  },

  approveReportCard(id: string, data: ReportCardAuditRequest) {
    return reportCardApi.approveReportCard(id, data)
  },

  rejectReportCard(id: string, data: ReportCardAuditRequest) {
    return reportCardApi.rejectReportCard(id, data)
  },

  withdrawReportCard(id: string) {
    return reportCardApi.withdrawReportCard(id)
  },

  getPendingReportCards() {
    return reportCardApi.getPendingReportCards()
  },

  getReportCardStatistics() {
    return reportCardApi.getReportCardStatistics()
  },

  getUnassignedReportCards(params?: {
    page?: number
    size?: number
    keyword?: string
    diseaseCategory?: string
    hospitalArea?: string
    department?: string
  }) {
    return reportCardApi.getUnassignedReportCards(params)
  },

  getReportCardsByAssignStatus(assignStatus: string, params?: Omit<ReportCardPageParams, 'assignStatus'>) {
    return reportCardApi.getReportCardsByAssignStatus(assignStatus, params)
  },

  // ========== LoginHistory Management ==========
  getLoginHistory(params: LoginHistoryPageParams) {
    return authApi.getLoginHistory(params)
  },

  deleteUserLoginHistory(userId: string) {
    return authApi.deleteUserLoginHistory(userId)
  },

  // ========== AuditGroup Management ==========
  getAuditGroups(params?: AuditGroupPageParams) {
    return auditGroupApi.getAuditGroups(params)
  },

  getAuditGroupById(id: string) {
    return auditGroupApi.getAuditGroupById(id)
  },

  createAuditGroup(data: CreateAuditGroupRequest) {
    return auditGroupApi.createAuditGroup(data)
  },

  updateAuditGroup(id: string, data: UpdateAuditGroupRequest) {
    return auditGroupApi.updateAuditGroup(id, data)
  },

  deleteAuditGroup(id: string) {
    return auditGroupApi.deleteAuditGroup(id)
  },

  activateAuditGroup(id: string) {
    return auditGroupApi.activateAuditGroup(id)
  },

  deactivateAuditGroup(id: string) {
    return auditGroupApi.deactivateAuditGroup(id)
  },

  searchAuditGroups(keyword: string) {
    return auditGroupApi.searchAuditGroups(keyword)
  },

  getActiveAuditGroups() {
    return auditGroupApi.getActiveAuditGroups()
  },

  getAuditGroupMembers(id: string) {
    return auditGroupApi.getAuditGroupMembers(id)
  },

  addGroupMembers(data: AddGroupMembersRequest) {
    return auditGroupApi.addGroupMembers(data)
  },

  removeGroupMembers(data: RemoveGroupMembersRequest) {
    return auditGroupApi.removeGroupMembers(data)
  },

  setAuditGroupLeader(id: string, leaderId: string) {
    return auditGroupApi.setAuditGroupLeader(id, leaderId)
  },

  checkGroupNameExists(groupName: string, excludeId?: string) {
    return auditGroupApi.checkGroupNameExists(groupName, excludeId)
  },

  checkGroupCodeExists(groupCode: string, excludeId?: string) {
    return auditGroupApi.checkGroupCodeExists(groupCode, excludeId)
  },

  // ========== Assignment Management ==========
  assignTask(data: AssignTaskRequest) {
    return assignmentApi.assignTask(data)
  },

  autoAssign(data: AutoAssignRequest) {
    return assignmentApi.autoAssign(data)
  },

  acceptTask(data: AcceptTaskRequest) {
    return assignmentApi.acceptTask(data)
  },

  completeTask(data: CompleteTaskRequest) {
    return assignmentApi.completeTask(data)
  },

  cancelTask(data: CancelTaskRequest) {
    return assignmentApi.cancelTask(data)
  },

  reassignTask(assignmentId: string, data: ReassignTaskRequest) {
    return assignmentApi.reassignTask(assignmentId, data)
  },

  getAssignmentById(assignmentId: string) {
    return assignmentApi.getAssignmentById(assignmentId)
  },

  getGroupAssignments(auditGroupId: string, params?: AssignmentPageParams) {
    return assignmentApi.getGroupAssignments(auditGroupId, params)
  },

  getPendingAssignments(params?: AssignmentPageParams) {
    return assignmentApi.getPendingAssignments(params)
  },

  getOverdueAssignments() {
    return assignmentApi.getOverdueAssignments()
  },

  getReportCardAssignments(reportCardId: string) {
    return assignmentApi.getReportCardAssignments(reportCardId)
  },

  getAssignmentLogs(assignmentId: string, params?: AssignmentLogPageParams) {
    return assignmentApi.getAssignmentLogs(assignmentId, params)
  },

  // ========== AssignmentRule Management ==========
  createAssignmentRule(data: CreateAssignmentRuleRequest) {
    return assignmentRuleApi.createRule(data)
  },

  updateAssignmentRule(ruleId: string, data: UpdateAssignmentRuleRequest) {
    return assignmentRuleApi.updateRule(ruleId, data)
  },

  deleteAssignmentRule(ruleId: string) {
    return assignmentRuleApi.deleteRule(ruleId)
  },

  getAssignmentRuleById(ruleId: string) {
    return assignmentRuleApi.getRuleById(ruleId)
  },

  getAssignmentRules(params?: AssignmentRulePageParams) {
    return assignmentRuleApi.getRules(params)
  },

  getActiveAssignmentRules() {
    return assignmentRuleApi.getActiveRules()
  },

  toggleAssignmentRule(ruleId: string) {
    return assignmentRuleApi.toggleRule(ruleId)
  },

  // ========== WorkStats Management ==========
  getGroupWorkStats(auditGroupId: string) {
    return workStatsApi.getGroupWorkStats(auditGroupId)
  },

  getAllWorkStats() {
    return workStatsApi.getAllWorkStats()
  },

  getLeastLoadedGroup() {
    return workStatsApi.getLeastLoadedGroup()
  }
}

export default api
