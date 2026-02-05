/*
项目统一api管理
*/

import request from './request'
import type {
  LoginRequest,
  LoginResponseData,
  UserInfo,
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

/** API 接口对象 */
interface ApiInterface {
  // user info
  /**
   * 获取当前用户信息
   * @returns 用户信息对象，包含用户名、角色、爱好、注册日期等
   */
  getUserInfo(): Promise<UserInfo>
  /**
   * 获取登录信息
   * @returns 登录信息，包含最后登录时间和地点
   */
  getLoginInfo(): Promise<UserInfo>

  // ========== RESTful User Management ==========
  /**
   * 分页查询用户列表 (RESTful)
   * @param params - 分页和筛选参数
   * @returns RESTful 分页响应
   */
  getUsers(params?: RestfulPageParams): Promise<RestfulPageResponse<UserDTO>>

  /**
   * 根据ID获取用户 (RESTful)
   * @param id - 用户ID
   * @returns 用户详情
   */
  getUserById(id: string): Promise<UserDTO>

  /**
   * 创建用户 (RESTful)
   * @param data - 用户创建数据 (必须包含password)
   * @returns 创建的用户
   */
  createUserRestful(data: CreateUserRequest): Promise<UserDTO>

  /**
   * 更新用户 (RESTful)
   * @param id - 用户ID
   * @param data - 更新数据
   * @returns 更新后的用户
   */
  updateUserRestful(id: string, data: UpdateUserRequest): Promise<UserDTO>

  /**
   * 删除用户 (RESTful)
   * @param id - 用户ID
   * @returns 操作结果
   */
  deleteUserRestful(id: string): Promise<{ message: string }>

  /**
   * 批量删除用户 (RESTful)
   * @param ids - 用户ID数组
   * @returns 操作结果
   */
  batchDeleteUsers(ids: string[]): Promise<{ message: string }>

  /**
   * 搜索用户 (RESTful)
   * @param keyword - 搜索关键词
   * @returns 用户列表
   */
  searchUsers(keyword: string): Promise<UserDTO[]>

  /**
   * 启用用户 (RESTful)
   * @param id - 用户ID
   * @returns 操作结果
   */
  activateUser(id: string): Promise<{ message: string }>

  /**
   * 停用用户 (RESTful)
   * @param id - 用户ID
   * @returns 操作结果
   */
  deactivateUser(id: string): Promise<{ message: string }>

  /**
   * 修改密码 (RESTful)
   * @param id - 用户ID
   * @param data - 密码数据
   * @returns 操作结果
   */
  changePassword(id: string, data: ChangePasswordRequest): Promise<{ message: string }>

  /**
   * 检查用户名是否存在 (RESTful)
   * @param username - 用户名
   * @param excludeId - 排除的用户ID (用于更新时检查)
   * @returns 是否存在
   */
  checkUsernameExists(username: string, excludeId?: string): Promise<boolean>

  // ========== RESTful ReportCard Management ==========
  /**
   * 分页查询报告卡列表 (RESTful)
   * @param params - 分页和筛选参数
   * @returns RESTful 分页响应
   */
  getReportCards(params?: ReportCardPageParams): Promise<RestfulPageResponse<ReportCardDTO>>

  /**
   * 根据ID获取报告卡 (RESTful)
   * @param id - 报告卡ID
   * @returns 报告卡详情
   */
  getReportCardById(id: string): Promise<ReportCardDTO>

  /**
   * 创建报告卡 (RESTful)
   * @param data - 报告卡创建数据
   * @returns 创建的报告卡
   */
  createReportCard(data: CreateReportCardRequest): Promise<ReportCardDTO>

  /**
   * 更新报告卡 (RESTful)
   * @param id - 报告卡ID
   * @param data - 更新数据
   * @returns 更新后的报告卡
   */
  updateReportCard(id: string, data: UpdateReportCardRequest): Promise<ReportCardDTO>

  /**
   * 删除报告卡 (RESTful)
   * @param id - 报告卡ID
   * @returns 操作结果
   */
  deleteReportCard(id: string): Promise<{ message: string }>

  /**
   * 审核通过报告卡 (RESTful)
   * @param id - 报告卡ID
   * @param data - 审核数据 (包含 auditorId 和可选的 remark)
   * @returns 操作结果
   */
  approveReportCard(id: string, data: ReportCardAuditRequest): Promise<{ message: string }>

  /**
   * 审核拒绝报告卡 (RESTful)
   * @param id - 报告卡ID
   * @param data - 审核数据 (包含 auditorId 和 remark)
   * @returns 操作结果
   */
  rejectReportCard(id: string, data: ReportCardAuditRequest): Promise<{ message: string }>

  /**
   * 撤回报告卡审核 (RESTful)
   * @param id - 报告卡ID
   * @returns 操作结果
   */
  withdrawReportCard(id: string): Promise<{ message: string }>

  /**
   * 获取待审核报告卡列表 (RESTful)
   * @returns 待审核报告卡列表
   */
  getPendingReportCards(): Promise<ReportCardDTO[]>

  /**
   * 获取报告卡统计信息 (RESTful)
   * @returns 各状态报告卡数量统计
   */
  getReportCardStatistics(): Promise<{ PENDING: number; APPROVED: number; REJECTED: number }>

  // login
  /**
   * 用户登录获取菜单权限
   * @param params - 登录凭证
   * @param params.username - 用户名
   * @param params.password - 密码
   * @returns 包含访问令牌和用户菜单权限列表的响应数据
   */
  getMenu(params: LoginRequest): Promise<LoginResponseData>
}

const api: ApiInterface = {
  // ========== user info ==========
  getUserInfo() {
    return request({
      url: '/user/getUserInfo',
      method: 'get'
    })
  },

  /** 获取用户登录历史信息 */
  getLoginInfo() {
    return request({
      url: '/user/getLoginInfo',
      method: 'get'
    })
  },

  // ========== RESTful User Management ==========
  /** 分页查询用户列表 (RESTful) */
  getUsers(params?: RestfulPageParams) {
    return request({
      url: '/users',
      method: 'get',
      params
    })
  },

  /** 根据ID获取用户 (RESTful) */
  getUserById(id: string) {
    return request({
      url: `/users/${id}`,
      method: 'get'
    })
  },

  /** 创建用户 (RESTful) */
  createUserRestful(data: CreateUserRequest) {
    return request({
      url: '/users',
      method: 'post',
      data
    })
  },

  /** 更新用户 (RESTful) */
  updateUserRestful(id: string, data: UpdateUserRequest) {
    return request({
      url: `/users/${id}`,
      method: 'put',
      data
    })
  },

  /** 删除用户 (RESTful) */
  deleteUserRestful(id: string) {
    return request({
      url: `/users/${id}`,
      method: 'delete'
    })
  },

  /** 批量删除用户 (RESTful) */
  batchDeleteUsers(ids: string[]) {
    return request({
      url: '/users/batch',
      method: 'delete',
      data: ids
    })
  },

  /** 搜索用户 (RESTful) */
  searchUsers(keyword: string) {
    return request({
      url: '/users/search',
      method: 'get',
      params: { keyword }
    })
  },

  /** 启用用户 (RESTful) */
  activateUser(id: string) {
    return request({
      url: `/users/${id}/activate`,
      method: 'put'
    })
  },

  /** 停用用户 (RESTful) */
  deactivateUser(id: string) {
    return request({
      url: `/users/${id}/deactivate`,
      method: 'put'
    })
  },

  /** 修改密码 (RESTful) */
  changePassword(id: string, data: ChangePasswordRequest) {
    return request({
      url: `/users/${id}/password`,
      method: 'put',
      data
    })
  },

  /** 检查用户名是否存在 (RESTful) */
  checkUsernameExists(username: string, excludeId?: string) {
    return request({
      url: '/users/check/username',
      method: 'get',
      params: { username, excludeId }
    })
  },

  // ========== RESTful ReportCard Management ==========
  /** 分页查询报告卡列表 (RESTful) */
  getReportCards(params?: ReportCardPageParams) {
    return request({
      url: '/report-cards',
      method: 'get',
      params
    })
  },

  /** 根据ID获取报告卡 (RESTful) */
  getReportCardById(id: string) {
    return request({
      url: `/report-cards/${id}`,
      method: 'get'
    })
  },

  /** 创建报告卡 (RESTful) */
  createReportCard(data: CreateReportCardRequest) {
    return request({
      url: '/report-cards',
      method: 'post',
      data
    })
  },

  /** 更新报告卡 (RESTful) */
  updateReportCard(id: string, data: UpdateReportCardRequest) {
    return request({
      url: `/report-cards/${id}`,
      method: 'put',
      data
    })
  },

  /** 删除报告卡 (RESTful) */
  deleteReportCard(id: string) {
    return request({
      url: `/report-cards/${id}`,
      method: 'delete'
    })
  },

  /** 审核通过报告卡 (RESTful) */
  approveReportCard(id: string, data: ReportCardAuditRequest) {
    return request({
      url: `/report-cards/${id}/approve`,
      method: 'put',
      data
    })
  },

  /** 审核拒绝报告卡 (RESTful) */
  rejectReportCard(id: string, data: ReportCardAuditRequest) {
    return request({
      url: `/report-cards/${id}/reject`,
      method: 'put',
      data
    })
  },

  /** 撤回报告卡审核 (RESTful) */
  withdrawReportCard(id: string) {
    return request({
      url: `/report-cards/${id}/withdraw`,
      method: 'put'
    })
  },

  /** 获取待审核报告卡列表 (RESTful) */
  getPendingReportCards() {
    return request({
      url: '/report-cards/pending',
      method: 'get'
    })
  },

  /** 获取报告卡统计信息 (RESTful) */
  getReportCardStatistics() {
    return request({
      url: '/report-cards/statistics',
      method: 'get'
    })
  },

  // ========== login ==========
  /**
   * 用户登录获取菜单权限
   * 测试账号: admin/admin (全部权限), user/user (部分权限)
   */
  getMenu(params: LoginRequest) {
    return request({
      url: '/permission/getMenu',
      method: 'post',
      data: params
    })
  }
}

export default api
