import Mock from 'mockjs'
import type {
  MockConfig,
  MockResponse,
  UserDTO,
  RestfulPageResponse,
  CreateUserRequest,
  UpdateUserRequest
} from '../types'

function param2Obj(url: string): any {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') +
      '"}'
  )
}

// Mock 用户数据存储
let List: UserDTO[] = []
const count = 200

for (let i = 0; i < count; i++) {
  List.push({
    id: Mock.Random.guid(),
    username: Mock.Random.word(5, 10),
    name: Mock.Random.cname(),
    email: Mock.Random.email(),
    phone: Mock.mock(/^1[3-9]\d{9}$/),
    role: Mock.Random.pick(['ADMIN', 'USER', 'GUEST', 'AUDITOR']),
    status: Mock.Random.pick(['ACTIVE', 'INACTIVE']),
    createTime: Mock.Random.datetime(),
    updateTime: Mock.Random.datetime(),
    lastLogin: Mock.Random.datetime()
  } as UserDTO)
}

// ========== RESTful API 处理函数 ==========

/**
 * GET /api/users - 分页查询用户列表
 */
const getUsers = (config: MockConfig): MockResponse<RestfulPageResponse<UserDTO>> => {
  const urlParams = param2Obj(config.url)
  const { keyword, page = 1, size = 10, role, status } = urlParams

  // 搜索过滤
  let mockList = List
  if (keyword) {
    const kw = keyword.toLowerCase()
    mockList = List.filter(item => {
      return (
        item.username?.toLowerCase().includes(kw) ||
        item.name?.toLowerCase().includes(kw) ||
        item.email?.toLowerCase().includes(kw) ||
        item.phone?.includes(kw)
      )
    })
  }

  // 角色过滤
  if (role) {
    mockList = mockList.filter(item => item.role === role)
  }

  // 状态过滤
  if (status) {
    mockList = mockList.filter(item => item.status === status)
  }

  // 分页 - 确保参数是数字类型
  const pageNum = Number(page) || 1
  const pageSize = Number(size) || 10
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const records = mockList.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      page: Number(page),
      size: Number(size),
      total: mockList.length,
      records
    }
  }
}

/**
 * GET /api/users/{id} - 根据ID获取用户
 */
const getUserById = (config: MockConfig): MockResponse<UserDTO> => {
  const urlParts = config.url.split('/')
  const id = urlParts[urlParts.length - 1]
  const user = List.find(item => item.id === id)

  if (!user) {
    return {
      code: 404,
      message: 'User not found'
    }
  }

  return {
    code: 200,
    message: 'success',
    data: user
  }
}

/**
 * POST /api/users - 创建用户
 */
const createUser = (config: MockConfig): MockResponse<UserDTO> => {
  const data: CreateUserRequest = JSON.parse(config.body || '{}')

  // 验证必填字段
  if (!data.username || !data.password || !data.name) {
    return {
      code: 400,
      message: 'Username, password and name are required'
    }
  }

  // 检查用户名是否已存在
  if (List.some(item => item.username === data.username)) {
    return {
      code: 400,
      message: 'Username already exists'
    }
  }

  const newUser: UserDTO = {
    id: Mock.Random.guid(),
    username: data.username,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role || 'USER',
    status: data.status || 'ACTIVE',
    dataScope: data.dataScope,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }

  List.unshift(newUser)

  return {
    code: 200,
    message: 'User created successfully',
    data: newUser
  }
}

/**
 * PUT /api/users/{id} - 更新用户
 */
const updateUser = (config: MockConfig): MockResponse<UserDTO> => {
  const urlParts = config.url.split('/')
  const id = urlParts[urlParts.length - 2]
  const data: UpdateUserRequest = JSON.parse(config.body || '{}')

  const index = List.findIndex(item => item.id === id)
  if (index === -1) {
    return {
      code: 404,
      message: 'User not found'
    }
  }

  List[index] = {
    ...List[index],
    ...data,
    updateTime: new Date().toISOString()
  }

  return {
    code: 200,
    message: 'User updated successfully',
    data: List[index]
  }
}

/**
 * DELETE /api/users/{id} - 删除用户
 */
const deleteUser = (config: MockConfig): MockResponse<{ message: string }> => {
  const urlParts = config.url.split('/')
  const id = urlParts[urlParts.length - 1]
  const index = List.findIndex(item => item.id === id)

  if (index === -1) {
    return {
      code: 404,
      message: 'User not found'
    }
  }

  List.splice(index, 1)

  return {
    code: 200,
    message: 'User deleted successfully',
    data: { message: 'User deleted successfully' }
  }
}

/**
 * DELETE /api/users/batch - 批量删除用户
 */
const batchDeleteUsers = (config: MockConfig): MockResponse<{ message: string }> => {
  const ids: string[] = JSON.parse(config.body || '[]')
  let deletedCount = 0

  ids.forEach(id => {
    const index = List.findIndex(item => item.id === id)
    if (index !== -1) {
      List.splice(index, 1)
      deletedCount++
    }
  })

  return {
    code: 200,
    message: `Deleted ${deletedCount} users successfully`,
    data: { message: `Deleted ${deletedCount} users successfully` }
  }
}

/**
 * GET /api/users/search - 搜索用户
 */
const searchUsers = (config: MockConfig): MockResponse<UserDTO[]> => {
  const { keyword } = param2Obj(config.url)

  if (!keyword) {
    return {
      code: 200,
      message: 'success',
      data: []
    }
  }

  const kw = keyword.toLowerCase()
  const results = List.filter(item => {
    return (
      item.username?.toLowerCase().includes(kw) ||
      item.name?.toLowerCase().includes(kw) ||
      item.email?.toLowerCase().includes(kw)
    )
  })

  return {
    code: 200,
    message: 'success',
    data: results
  }
}

/**
 * PUT /api/users/{id}/activate - 启用用户
 */
const activateUser = (config: MockConfig): MockResponse<{ message: string }> => {
  const urlParts = config.url.split('/')
  const id = urlParts[urlParts.length - 2]
  const user = List.find(item => item.id === id)

  if (!user) {
    return {
      code: 404,
      message: 'User not found'
    }
  }

  user.status = 'ACTIVE'
  user.updateTime = new Date().toISOString()

  return {
    code: 200,
    message: 'User activated successfully',
    data: { message: 'User activated successfully' }
  }
}

/**
 * PUT /api/users/{id}/deactivate - 停用用户
 */
const deactivateUser = (config: MockConfig): MockResponse<{ message: string }> => {
  const urlParts = config.url.split('/')
  const id = urlParts[urlParts.length - 2]
  const user = List.find(item => item.id === id)

  if (!user) {
    return {
      code: 404,
      message: 'User not found'
    }
  }

  user.status = 'INACTIVE'
  user.updateTime = new Date().toISOString()

  return {
    code: 200,
    message: 'User deactivated successfully',
    data: { message: 'User deactivated successfully' }
  }
}

/**
 * PUT /api/users/{id}/password - 修改密码
 */
const changePassword = (config: MockConfig): MockResponse<{ message: string }> => {
  const urlParts = config.url.split('/')
  const id = urlParts[urlParts.length - 2]
  const user = List.find(item => item.id === id)

  if (!user) {
    return {
      code: 404,
      message: 'User not found'
    }
  }

  user.updateTime = new Date().toISOString()

  return {
    code: 200,
    message: 'Password changed successfully',
    data: { message: 'Password changed successfully' }
  }
}

/**
 * GET /api/users/check/username - 检查用户名是否存在
 */
const checkUsername = (config: MockConfig): MockResponse<boolean> => {
  const { username, excludeId } = param2Obj(config.url)

  const exists = List.some(item => item.username === username && item.id !== excludeId)

  return {
    code: 200,
    message: 'success',
    data: exists
  }
}

export default {
  // RESTful API
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  batchDeleteUsers,
  searchUsers,
  activateUser,
  deactivateUser,
  changePassword,
  checkUsername
}
