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
  AuditRejectParams
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
  // user management
  /**
   * 获取用户管理列表（分页）
   * @param data - 分页查询参数
   * @param data.keyWord - 搜索关键词
   * @param data.page - 页码，默认1
   * @param data.limit - 每页数量，默认15
   * @returns 包含分页用户列表和总数的响应对象
   */
  getUserList(data: PageParams): Promise<TableDataResponse<UserItem>>
  /**
   * 删除用户
   * @param data - 删除参数
   * @param data.id - 要删除的用户ID
   * @returns 操作结果，success 为 true 表示删除成功
   */
  deleteUser(data: { id: string }): Promise<{ success: boolean }>
  /**
   * 创建新用户
   * @param data - 用户表单数据（用户名、姓名、邮箱、电话、角色等）
   * @returns 操作结果，success 为 true 表示创建成功
   */
  createUser(data: UserFormData): Promise<{ success: boolean }>
  /**
   * 更新用户信息
   * @param data - 用户表单数据，需包含 id 字段指定要更新的用户
   * @returns 操作结果，success 为 true 表示更新成功
   */
  updateUser(data: UserFormData): Promise<{ success: boolean }>
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

  // ========== user management ==========
  /** 获取用户管理列表（分页） */
  getUserList(data: PageParams) {
    return request({
      url: '/user/getUserList',
      method: 'get',
      data
    })
  },

  /** 删除用户 */
  deleteUser(data: { id: string }) {
    return request({
      url: '/user/deleteUser',
      method: 'get',
      data
    })
  },

  /** 创建新用户 */
  createUser(data: UserFormData) {
    return request({
      url: '/user/createUser',
      method: 'post',
      data
    })
  },

  /** 更新用户信息 */
  updateUser(data: UserFormData) {
    return request({
      url: '/user/updateUser',
      method: 'post',
      data
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
  }
}

export default api
