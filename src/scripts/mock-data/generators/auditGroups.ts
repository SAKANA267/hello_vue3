import { query, batchInsert, hasData, truncateTable } from '../db'
import { generateId, generateShortId, printSuccess, printInfo } from '../utils'
import { auditGroupTemplates, mockConfig } from '../config'
import type { GeneratedUsers } from './users'

/**
 * AuditGroup 接口
 */
interface AuditGroup {
  id: string
  group_name: string
  group_code: string
  description?: string
  leader_id?: string
  status: string
  create_time: Date
  update_time?: Date
  deleted: boolean
}

/**
 * AuditGroupMember 接口
 */
interface AuditGroupMember {
  id: string
  group_id: string
  user_id: string
  join_time: Date
  create_time: Date
}

/**
 * AuditGroupWorkStats 接口
 */
interface AuditGroupWorkStats {
  id: string
  audit_group_id: string
  total_assigned: number
  total_completed: number
  total_cancelled: number
  pending_count: number
  in_progress_count: number
  avg_process_time: number
  last_task_time?: Date
  create_time: Date
  update_time?: Date
  deleted: boolean
}

/**
 * 存储生成的审核组数据
 */
export interface GeneratedAuditGroups {
  groups: AuditGroup[]
  members: AuditGroupMember[]
  stats: AuditGroupWorkStats[]
  byId: Map<string, AuditGroup>
  byCode: Map<string, AuditGroup>
  groupMembers: Map<string, string[]> // group_id -> user_ids
}

const generatedData: GeneratedAuditGroups = {
  groups: [],
  members: [],
  stats: [],
  byId: new Map(),
  byCode: new Map(),
  groupMembers: new Map()
}

/**
 * 生成审核组数据
 */
async function generateAuditGroupsInternal(users: GeneratedUsers): Promise<void> {
  printInfo('正在生成审核组数据...')

  const now = new Date()

  // 使用模板生成审核组
  for (let i = 0; i < Math.min(mockConfig.counts.auditGroups, auditGroupTemplates.length); i++) {
    const template = auditGroupTemplates[i]
    const leader = users.leaders[i]

    const group: AuditGroup = {
      id: generateId(),
      group_name: template.group_name,
      group_code: template.group_code,
      description: template.description,
      leader_id: leader?.id,
      status: 'ACTIVE',
      create_time: now,
      update_time: now,
      deleted: false
    }

    generatedData.groups.push(group)
    generatedData.byId.set(group.id, group)
    generatedData.byCode.set(group.group_code, group)
    generatedData.groupMembers.set(group.id, [])
  }

  // 批量插入
  const columns = ['id', 'group_name', 'group_code', 'description', 'leader_id',
                   'status', 'create_time', 'update_time', 'deleted']

  await batchInsert('audit_group', columns, generatedData.groups.map(g => [
    g.id, g.group_name, g.group_code, g.description, g.leader_id || null,
    g.status, g.create_time, g.update_time, g.deleted
  ]))

  printSuccess(`插入审核组 ${generatedData.groups.length} 个`)
}

/**
 * 生成审核组成员数据
 */
async function generateAuditGroupMembers(users: GeneratedUsers): Promise<void> {
  printInfo('正在生成审核组成员数据...')

  const now = new Date()

  // 为每个审核组分配成员
  for (const group of generatedData.groups) {
    const memberCount = mockConfig.counts.membersPerGroup

    // 收集该组的成员：组长 + 审核员
    const groupMembers: string[] = []

    // 添加组长
    if (group.leader_id) {
      groupMembers.push(group.leader_id)
    }

    // 随机分配审核员
    const availableAuditors = users.auditors.filter(u => !groupMembers.includes(u.id))
    const selectedAuditors = availableAuditors
      .sort(() => Math.random() - 0.5)
      .slice(0, memberCount - groupMembers.length)

    for (const auditor of selectedAuditors) {
      groupMembers.push(auditor.id)
    }

    // 生成成员记录
    for (const userId of groupMembers) {
      const member: AuditGroupMember = {
        id: generateId(),
        group_id: group.id,
        user_id: userId,
        join_time: now,
        create_time: now
      }

      generatedData.members.push(member)
    }

    generatedData.groupMembers.set(group.id, groupMembers)
  }

  // 批量插入
  const columns = ['id', 'group_id', 'user_id', 'join_time', 'create_time']

  await batchInsert('audit_group_member', columns, generatedData.members.map(m => [
    m.id, m.group_id, m.user_id, m.join_time, m.create_time
  ]))

  printSuccess(`插入审核组成员 ${generatedData.members.length} 条`)

  // 打印每个组的成员数量
  for (const group of generatedData.groups) {
    const memberCount = generatedData.groupMembers.get(group.id)?.length || 0
    printInfo(`  - ${group.group_name}: ${memberCount} 名成员`)
  }
}

/**
 * 生成审核组工作统计数据
 */
async function generateAuditGroupWorkStats(): Promise<void> {
  printInfo('正在生成审核组统计数据...')

  const now = new Date()

  for (const group of generatedData.groups) {
    const stats: AuditGroupWorkStats = {
      id: generateId(),
      audit_group_id: group.id,
      total_assigned: Math.floor(Math.random() * 100) + 20,
      total_completed: Math.floor(Math.random() * 80) + 10,
      total_cancelled: Math.floor(Math.random() * 10),
      pending_count: Math.floor(Math.random() * 10),
      in_progress_count: Math.floor(Math.random() * 5),
      avg_process_time: Math.floor(Math.random() * 120) + 30, // 30-150分钟
      last_task_time: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
      create_time: now,
      update_time: now,
      deleted: false
    }

    generatedData.stats.push(stats)
  }

  // 批量插入
  const columns = ['id', 'audit_group_id', 'total_assigned', 'total_completed',
                   'total_cancelled', 'pending_count', 'in_progress_count',
                   'avg_process_time', 'last_task_time', 'create_time',
                   'update_time', 'deleted']

  await batchInsert('audit_group_work_stats', columns, generatedData.stats.map(s => [
    s.id, s.audit_group_id, s.total_assigned, s.total_completed,
    s.total_cancelled, s.pending_count, s.in_progress_count,
    s.avg_process_time, s.last_task_time || null, s.create_time,
    s.update_time, s.deleted
  ]))

  printSuccess(`插入审核组统计 ${generatedData.stats.length} 条`)
}

/**
 * 生成审核组数据（主函数）
 */
export async function generateAuditGroups(
  users: GeneratedUsers,
  clean: boolean = false
): Promise<GeneratedAuditGroups> {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('第 3 步: 生成审核组数据')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // 检查是否已有数据
  const hasGroups = await hasData('audit_group')

  if (hasGroups) {
    if (clean) {
      printInfo('清理模式：清空现有数据...')
      // 需要先清空依赖 audit_group 的表
      await truncateTable('assignment_operation_log')
      await truncateTable('report_card_assignment')
      await truncateTable('audit_group_work_stats')
      await truncateTable('audit_group_member')
      await truncateTable('audit_group')
      // 清空后重置数据
      generatedData.groups = []
      generatedData.members = []
      generatedData.stats = []
      generatedData.byId.clear()
      generatedData.byCode.clear()
      generatedData.groupMembers.clear()
    } else {
      console.log('⚠ 数据库中已存在审核组数据，跳过生成（使用 --clean 选项可清空并重新生成）')
      await loadExistingAuditGroups()
      return generatedData
    }
  }

  await generateAuditGroupsInternal(users)
  await generateAuditGroupMembers(users)
  await generateAuditGroupWorkStats()

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  return generatedData
}

/**
 * 加载现有审核组数据
 */
/**
 * 加载现有审核组数据
 */
async function loadExistingAuditGroups(): Promise<void> {
  // 加载审核组
  const groups = await query(
    'SELECT * FROM audit_group WHERE deleted = 0'
  ) as AuditGroup[]

  for (const group of groups) {
    generatedData.groups.push(group)
    generatedData.byId.set(group.id, group)
    generatedData.byCode.set(group.group_code, group)
    generatedData.groupMembers.set(group.id, [])
  }

  // 加载组成员
  const members = await query(
    'SELECT * FROM audit_group_member'
  ) as AuditGroupMember[]

  for (const member of members) {
    generatedData.members.push(member)
    const membersList = generatedData.groupMembers.get(member.group_id)
    if (membersList) {
      membersList.push(member.user_id)
    }
  }

  printInfo(`已加载现有审核组: ${groups.length} 个, ${members.length} 名成员`)
}
