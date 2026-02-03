/*
项目统一api管理
*/

import request from './request'
import type {
  LoginRequest,
  LoginResponseData,
  ObjectFormData,
  PageParams,
  TableDataResponse,
  UserFormData,
  UserInfo,
  ObjectItem,
  UserItem,
  AuditPassParams,
  AuditRejectParams,
  AuditRevokeParams,
  // RESTful types
  RestfulPageParams,
  RestfulPageResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserDTO,
  ChangePasswordRequest
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
  // object management
  /**
   * 获取对象管理列表（分页）
   * @param data - 分页查询参数
   * @param data.keyWord - 搜索关键词（支持姓名/院区/科室/诊断名称/住院号/门诊号/联系电话）
   * @param data.page - 页码，默认1
   * @param data.limit - 每页数量，默认15
   * @returns 包含分页列表和总数的响应对象
   */
  getTableData(data: PageParams): Promise<TableDataResponse<ObjectItem>>
  /**
   * 删除对象记录
   * @param data - 删除参数
   * @param data.id - 要删除的对象ID
   * @returns 操作结果，success 为 true 表示删除成功
   */
  deleteObject(data: { id: string }): Promise<{ success: boolean }>
  /**
   * 创建新的对象记录
   * @param data - 对象表单数据（院区、科室、诊断名称、患者信息等）
   * @returns 操作结果，success 为 true 表示创建成功
   */
  createObject(data: ObjectFormData): Promise<{ success: boolean }>
  /**
   * 更新对象记录
   * @param data - 对象表单数据，需包含 id 字段指定要更新的记录
   * @returns 操作结果，success 为 true 表示更新成功
   */
  updateObject(data: ObjectFormData): Promise<{ success: boolean }>

  // ========== RESTful User Management (新增) ==========
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

  // login
  /**
   * 用户登录获取菜单权限
   * @param params - 登录凭证
   * @param params.username - 用户名
   * @param params.password - 密码
   * @returns 包含访问令牌和用户菜单权限列表的响应数据
   */
  getMenu(params: LoginRequest): Promise<LoginResponseData>
  // audit
  /**
   * 审核通过
   * @param data - 审核通过参数
   * @param data.id - 要审核的对象ID
   * @param data.auditor - 审核人姓名
   * @param data.auditDate - 审核日期，格式 yyyy-MM-dd
   * @param data.status - 固定值 '已审核'
   * @returns 操作结果和消息
   */
  auditPass(data: AuditPassParams): Promise<{ success: boolean; msg?: string }>
  /**
   * 审核不通过
   * @param data - 审核不通过参数
   * @param data.id - 要审核的对象ID
   * @param data.auditor - 审核人姓名
   * @param data.auditDate - 审核日期，格式 yyyy-MM-dd
   * @param data.status - 固定值 '审核不通过'
   * @param data.remark - 审核不通过原因（可选）
   * @returns 操作结果和消息
   */
  auditReject(data: AuditRejectParams): Promise<{ success: boolean; msg?: string }>
  /**
   * 撤回审核
   * @param data - 撤回审核参数
   * @param data.id - 要撤回的对象ID
   * @param data.status - 固定值 '待审核'
   * @returns 操作结果和消息
   */
  auditRevoke(data: AuditRevokeParams): Promise<{ success: boolean; msg?: string }>
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

  // ========== object management ==========
  /**
   * 获取对象管理列表（分页）
   * 支持按姓名、院区、科室、诊断名称、住院号、门诊号、联系电话搜索
   */
  getTableData(data: PageParams) {
    return request({
      url: '/table/getTableData',
      method: 'get',
      data
    })
  },

  /** 删除对象记录 */
  deleteObject(data: { id: string }) {
    return request({
      url: '/table/deleteObject',
      method: 'get',
      data
    })
  },

  /** 创建新的对象记录 */
  createObject(data: ObjectFormData) {
    return request({
      url: '/table/createObject',
      method: 'post',
      data
    })
  },

  /** 更新对象记录 */
  updateObject(data: ObjectFormData) {
    return request({
      url: '/table/updateObject',
      method: 'post',
      data
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
  },

  // ========== audit ==========
  /** 审核通过 */
  auditPass(data: AuditPassParams) {
    return request({
      url: '/table/auditPass',
      method: 'post',
      data
    })
  },

  /** 审核不通过 */
  auditReject(data: AuditRejectParams) {
    return request({
      url: '/table/auditReject',
      method: 'post',
      data
    })
  },

  /** 撤回审核 */
  auditRevoke(data: AuditRevokeParams) {
    return request({
      url: '/table/auditRevoke',
      method: 'post',
      data
    })
  }
}

export default api
