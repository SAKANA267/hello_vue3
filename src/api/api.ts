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
  ReportCardPageParams
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
  }
}

export default api
