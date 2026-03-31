/*
 * 审核组 Mock 数据
 * @since: 2026-03-31
 */

import Mock from 'mockjs'
import type { MockConfig, MockResponse } from '@/api/types'
import type {
  AuditGroupDTO,
  AuditGroupMemberDTO,
  RestfulPageResponse,
  AuditGroupStatusEnum
} from '@/api/types'

// URL 参数解析工具函数
function param2Obj(url: string) {
  const search = url.split('?')[1]
  if (!search) return {}
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  )
}

// ============== Mock 数据存储 ==============

/** 审核组数据 */
let auditGroups: AuditGroupDTO[] = []
const groupCount = 50

// 初始化审核组数据
for (let i = 0; i < groupCount; i++) {
  const status: AuditGroupStatusEnum = Mock.Random.pick(['ACTIVE', 'INACTIVE'])
  auditGroups.push({
    id: Mock.Random.guid(),
    groupName: `第${i + 1}审核组`,
    groupCode: `AUDIT_GROUP_${String(i + 1).padStart(2, '0')}`,
    description: Mock.Random.csentence(10, 20),
    leaderId: Mock.Random.guid(),
    leaderName: Mock.Random.cname(),
    status,
    memberCount: Mock.Random.integer(0, 20),
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  })
}

// 添加数据库中的真实审核组
auditGroups.unshift(
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    groupName: '第一审核组',
    groupCode: 'AUDIT_GROUP_01',
    description: '负责传染病报告卡的初步审核工作',
    leaderId: '1',
    leaderName: '系统管理员',
    status: 'ACTIVE',
    memberCount: 3,
    createTime: '2026-03-31 06:15:59',
    updateTime: '2026-03-31 06:15:59'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    groupName: '第二审核组',
    groupCode: 'AUDIT_GROUP_02',
    description: '负责复杂病例的复核与评估',
    leaderId: '3',
    leaderName: '审核员',
    status: 'ACTIVE',
    memberCount: 2,
    createTime: '2026-03-31 06:15:59',
    updateTime: '2026-03-31 06:15:59'
  }
)

/** 审核组成员数据 Map<groupId, members[]> */
const groupMembers: Map<string, AuditGroupMemberDTO[]> = new Map()

// 添加真实审核组的成员数据（第一审核组）
groupMembers.set('550e8400-e29b-41d4-a716-446655440001', [
  {
    userId: '1',
    username: 'admin',
    name: '系统管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    role: 'ADMIN',
    status: 'ACTIVE',
    joinTime: '2026-03-31 06:19:51'
  },
  {
    userId: '1752ed30-f187-4af7-b1af-f7107aed03c7',
    username: '12341234',
    name: 'sak1an',
    email: 'sak1an@example.com',
    phone: '13800138001',
    role: 'ADMIN',
    status: 'ACTIVE',
    joinTime: '2026-03-31 06:19:51'
  },
  {
    userId: '3',
    username: 'auditor',
    name: '审核员',
    email: 'auditor@example.com',
    phone: '13800138003',
    role: 'AUDITOR',
    status: 'ACTIVE',
    joinTime: '2026-03-31 06:19:51'
  }
])

// 添加真实审核组的成员数据（第二审核组）
groupMembers.set('550e8400-e29b-41d4-a716-446655440002', [
  {
    userId: '2',
    username: 'user',
    name: '普通用户',
    email: 'user@example.com',
    phone: '13800138002',
    role: 'USER',
    status: 'ACTIVE',
    joinTime: '2026-03-31 06:19:51'
  },
  {
    userId: '21c73972-7c4d-4eb2-8239-5c74a179d12d',
    username: 'sakana',
    name: '杨敬平',
    email: 'sakana@example.com',
    phone: '13800138004',
    role: 'ADMIN',
    status: 'ACTIVE',
    joinTime: '2026-03-31 06:19:51'
  }
])

// 为其他模拟审核组生成成员数据
for (let i = 2; i < auditGroups.length; i++) {
  const group = auditGroups[i]
  const memberCount = group.memberCount
  const members: AuditGroupMemberDTO[] = []
  for (let j = 0; j < memberCount; j++) {
    const userId = Mock.Random.guid()
    members.push({
      userId,
      username: `user_${i}_${j}`,
      name: Mock.Random.cname(),
      email: Mock.Random.email(),
      phone: Mock.mock(/^1[3-9]\d{9}$/),
      role: Mock.Random.pick(['AUDITOR', 'ADMIN']),
      status: 'ACTIVE',
      joinTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }
  // 设置第一个成员为组长
  if (members.length > 0) {
    group.leaderId = members[0].userId
    group.leaderName = members[0].name
  }
  groupMembers.set(group.id, members)
}

// ============== Mock API 处理函数 ==============

/**
 * 分页查询审核组列表
 * GET /api/audit-groups
 */
export const getAuditGroups = (config: MockConfig): MockResponse<RestfulPageResponse<AuditGroupDTO>> => {
  const urlParams = param2Obj(config.url)
  const { keyword, page = 1, size = 10, status } = urlParams

  // 过滤
  let mockList = [...auditGroups]
  if (keyword) {
    mockList = mockList.filter(
      item => item.groupName?.includes(keyword) || item.groupCode?.includes(keyword)
    )
  }
  if (status) {
    mockList = mockList.filter(item => item.status === status)
  }

  // 分页
  const start = (page - 1) * size
  const end = start + parseInt(size as string)
  const records = mockList.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      page: parseInt(page as string),
      size: parseInt(size as string),
      total: mockList.length,
      records
    }
  }
}

/**
 * 根据ID获取审核组
 * GET /api/audit-groups/{id}
 */
export const getAuditGroupById = (config: MockConfig): MockResponse<AuditGroupDTO> => {
  const id = config.url.split('/').pop()
  const group = auditGroups.find(item => item.id === id)

  if (!group) {
    return { code: 404, message: '审核组不存在' }
  }

  return {
    code: 200,
    message: 'success',
    data: group
  }
}

/**
 * 创建审核组
 * POST /api/audit-groups
 */
export const createAuditGroup = (config: MockConfig): MockResponse<AuditGroupDTO> => {
  const body = JSON.parse(config.body)
  const { groupName, groupCode, description, status = 'ACTIVE' } = body

  // 检查组名是否存在
  if (auditGroups.some(item => item.groupName === groupName)) {
    return { code: 400, message: '审核组名称已存在' }
  }

  // 检查组编码是否存在
  if (auditGroups.some(item => item.groupCode === groupCode)) {
    return { code: 400, message: '审核组编码已存在' }
  }

  const newGroup: AuditGroupDTO = {
    id: Mock.Random.guid(),
    groupName,
    groupCode,
    description,
    status,
    memberCount: 0,
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  }

  auditGroups.unshift(newGroup)
  groupMembers.set(newGroup.id, [])

  return {
    code: 200,
    message: '审核组创建成功',
    data: newGroup
  }
}

/**
 * 更新审核组
 * PUT /api/audit-groups/{id}
 */
export const updateAuditGroup = (config: MockConfig): MockResponse<AuditGroupDTO> => {
  const id = config.url.split('/').slice(-2, -1)[0]
  const body = JSON.parse(config.body)

  const index = auditGroups.findIndex(item => item.id === id)
  if (index === -1) {
    return { code: 404, message: '审核组不存在' }
  }

  // 检查组名是否存在（排除自己）
  if (body.groupName && auditGroups.some(item => item.groupName === body.groupName && item.id !== id)) {
    return { code: 400, message: '审核组名称已存在' }
  }

  const updated = { ...auditGroups[index], ...body, updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss') }
  auditGroups[index] = updated

  return {
    code: 200,
    message: '审核组信息更新成功',
    data: updated
  }
}

/**
 * 删除审核组
 * DELETE /api/audit-groups/{id}
 */
export const deleteAuditGroup = (config: MockConfig): MockResponse<{ message: string }> => {
  const id = config.url.split('/').pop()

  if (!id) {
    return { code: 400, message: '无效的审核组ID' }
  }

  const index = auditGroups.findIndex(item => item.id === id)
  if (index === -1) {
    return { code: 404, message: '审核组不存在' }
  }

  auditGroups.splice(index, 1)
  groupMembers.delete(id)

  return {
    code: 200,
    message: '审核组已删除'
  }
}

/**
 * 启用审核组
 * PUT /api/audit-groups/{id}/activate
 */
export const activateAuditGroup = (config: MockConfig): MockResponse<{ message: string }> => {
  const id = config.url.split('/').slice(-2, -1)[0]

  const group = auditGroups.find(item => item.id === id)
  if (!group) {
    return { code: 404, message: '审核组不存在' }
  }

  group.status = 'ACTIVE'

  return {
    code: 200,
    message: '审核组已启用'
  }
}

/**
 * 停用审核组
 * PUT /api/audit-groups/{id}/deactivate
 */
export const deactivateAuditGroup = (config: MockConfig): MockResponse<{ message: string }> => {
  const id = config.url.split('/').slice(-2, -1)[0]

  const group = auditGroups.find(item => item.id === id)
  if (!group) {
    return { code: 404, message: '审核组不存在' }
  }

  group.status = 'INACTIVE'

  return {
    code: 200,
    message: '审核组已停用'
  }
}

/**
 * 搜索审核组
 * GET /api/audit-groups/search
 */
export const searchAuditGroups = (config: MockConfig): MockResponse<AuditGroupDTO[]> => {
  const urlParams = param2Obj(config.url)
  const { keyword } = urlParams

  if (!keyword) {
    return { code: 200, message: 'success', data: [] }
  }

  const results = auditGroups.filter(
    item => item.groupName?.includes(keyword) || item.groupCode?.includes(keyword)
  )

  return {
    code: 200,
    message: 'success',
    data: results
  }
}

/**
 * 获取所有启用的审核组
 * GET /api/audit-groups/active
 */
export const getActiveAuditGroups = (): MockResponse<AuditGroupDTO[]> => {
  const results = auditGroups.filter(item => item.status === 'ACTIVE')

  return {
    code: 200,
    message: 'success',
    data: results
  }
}

/**
 * 获取审核组成员
 * GET /api/audit-groups/{id}/members
 */
export const getAuditGroupMembers = (config: MockConfig): MockResponse<AuditGroupMemberDTO[]> => {
  const id = config.url.split('/').slice(-2, -1)[0]

  const members = groupMembers.get(id) || []

  return {
    code: 200,
    message: 'success',
    data: members
  }
}

/**
 * 添加组成员
 * POST /api/audit-groups/members/add
 */
export const addGroupMembers = (config: MockConfig): MockResponse<{ message: string }> => {
  const body = JSON.parse(config.body)
  const { groupId, userIds } = body

  const group = auditGroups.find(item => item.id === groupId)
  if (!group) {
    return { code: 404, message: '审核组不存在' }
  }

  let members = groupMembers.get(groupId) || []
  const existingUserIds = members.map(m => m.userId)

  // 过滤已存在的成员
  const newUserIds = userIds.filter((id: string) => !existingUserIds.includes(id))

  // 添加新成员
  const newMembers: AuditGroupMemberDTO[] = newUserIds.map((userId: string) => ({
    userId,
    username: `user_${userId.slice(0, 8)}`,
    name: Mock.Random.cname(),
    email: Mock.Random.email(),
    phone: Mock.mock(/^1[3-9]\d{9}$/),
    role: 'AUDITOR',
    status: 'ACTIVE',
    joinTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  }))

  members = [...members, ...newMembers]
  groupMembers.set(groupId, members)
  group.memberCount = members.length

  return {
    code: 200,
    message: '成员添加成功'
  }
}

/**
 * 移除组成员
 * POST /api/audit-groups/members/remove
 */
export const removeGroupMembers = (config: MockConfig): MockResponse<{ message: string }> => {
  const body = JSON.parse(config.body)
  const { groupId, userIds } = body

  const group = auditGroups.find(item => item.id === groupId)
  if (!group) {
    return { code: 404, message: '审核组不存在' }
  }

  let members = groupMembers.get(groupId) || []
  members = members.filter(m => !userIds.includes(m.userId))

  groupMembers.set(groupId, members)
  group.memberCount = members.length

  // 如果组长被移除，清空组长
  if (userIds.includes(group.leaderId || '')) {
    group.leaderId = undefined
    group.leaderName = undefined
  }

  return {
    code: 200,
    message: '成员移除成功'
  }
}

/**
 * 设置审核组组长
 * PUT /api/audit-groups/{id}/leader
 */
export const setAuditGroupLeader = (config: MockConfig): MockResponse<{ message: string }> => {
  const urlParams = param2Obj(config.url)
  const id = config.url.split('/').slice(-3, -2)[0]
  const { leaderId } = urlParams

  const group = auditGroups.find(item => item.id === id)
  if (!group) {
    return { code: 404, message: '审核组不存在' }
  }

  const members = groupMembers.get(id) || []
  const leader = members.find(m => m.userId === leaderId)
  if (!leader) {
    return { code: 400, message: '指定的用户不在该审核组中' }
  }

  group.leaderId = leaderId
  group.leaderName = leader.name

  return {
    code: 200,
    message: '组长设置成功'
  }
}

/**
 * 检查组名是否存在
 * GET /api/audit-groups/check/name
 */
export const checkGroupNameExists = (config: MockConfig): MockResponse<boolean> => {
  const urlParams = param2Obj(config.url)
  const { groupName, excludeId } = urlParams

  const exists = auditGroups.some(
    item => item.groupName === groupName && item.id !== excludeId
  )

  return {
    code: 200,
    message: 'success',
    data: exists
  }
}

/**
 * 检查组编码是否存在
 * GET /api/audit-groups/check/code
 */
export const checkGroupCodeExists = (config: MockConfig): MockResponse<boolean> => {
  const urlParams = param2Obj(config.url)
  const { groupCode, excludeId } = urlParams

  const exists = auditGroups.some(
    item => item.groupCode === groupCode && item.id !== excludeId
  )

  return {
    code: 200,
    message: 'success',
    data: exists
  }
}

// ============== Mock 注册 ==============

export default function registerAuditGroupMock() {
  Mock.mock(/\/api\/audit-groups(\?.*)?$/, 'get', getAuditGroups)
  Mock.mock(/\/api\/audit-groups\/[a-f0-9-]+(\?.*)?$/, 'get', getAuditGroupById)
  Mock.mock(/\/api\/audit-groups$/, 'post', createAuditGroup)
  Mock.mock(/\/api\/audit-groups\/[a-f0-9-]+$/, 'put', updateAuditGroup)
  Mock.mock(/\/api\/audit-groups\/[a-f0-9-]+$/, 'delete', deleteAuditGroup)
  Mock.mock(/\/api\/audit-groups\/[a-f0-9-]+\/activate$/, 'put', activateAuditGroup)
  Mock.mock(/\/api\/audit-groups\/[a-f0-9-]+\/deactivate$/, 'put', deactivateAuditGroup)
  Mock.mock(/\/api\/audit-groups\/search(\?.*)?$/, 'get', searchAuditGroups)
  Mock.mock(/\/api\/audit-groups\/active$/, 'get', getActiveAuditGroups)
  Mock.mock(/\/api\/audit-groups\/[a-f0-9-]+\/members$/, 'get', getAuditGroupMembers)
  Mock.mock(/\/api\/audit-groups\/members\/add$/, 'post', addGroupMembers)
  Mock.mock(/\/api\/audit-groups\/members\/remove$/, 'post', removeGroupMembers)
  Mock.mock(/\/api\/audit-groups\/[a-f0-9-]+\/leader(\?.*)?$/, 'put', setAuditGroupLeader)
  Mock.mock(/\/api\/audit-groups\/check\/name(\?.*)?$/, 'get', checkGroupNameExists)
  Mock.mock(/\/api\/audit-groups\/check\/code(\?.*)?$/, 'get', checkGroupCodeExists)
}
