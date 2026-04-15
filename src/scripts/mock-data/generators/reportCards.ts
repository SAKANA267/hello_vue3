import { query, batchInsert, hasData, truncateTable } from '../db'
import {
  generateId,
  randomChoice,
  randomDate,
  randomDateAfter,
  randomGender,
  randomAge,
  randomPhone,
  formatDate,
  formatDateTime,
  printSuccess,
  printInfo,
  getRandomByDistribution,
  hoursBetween
} from '../utils'
import { mockConfig, getRandomByDistribution as getDist, hospitalAreas } from '../config'
import type { GeneratedDiseases } from './diseases'
import type { GeneratedUsers } from './users'
import type { GeneratedAuditGroups } from './auditGroups'
import type { GeneratedDiseases } from './diseases'
import type { GeneratedUsers } from './users'
import type { GeneratedAuditGroups } from './auditGroups'

/**
 * ReportCard 接口
 */
interface ReportCard {
  id: string
  hospital_area: string
  department: string
  diagnosis_name: string
  inpatient_no: string
  outpatient_no: string
  name: string
  gender: string
  age: number
  phone: string
  report_doctor: string
  fill_date: Date
  audit_date?: Date
  auditor?: string
  auditor_id?: string
  status: string
  assign_status: string
  audit_status: string
  remark?: string
  create_time: Date
  update_time?: Date
  deleted: boolean
}

/**
 * ReportCardAssignment 接口
 */
interface ReportCardAssignment {
  id: string
  report_card_id: string
  audit_group_id: string
  assigner_id: string
  status: string
  assign_time: Date
  deadline?: Date
  accept_time?: Date
  complete_time?: Date
  priority: string
  remark?: string
  reject_reason?: string
  version: number
  create_time: Date
  update_time?: Date
  deleted: boolean
}

/**
 * AssignmentOperationLog 接口
 */
interface AssignmentOperationLog {
  id: string
  assignment_id: string
  report_card_id: string
  operation_type: string
  operator_id: string
  operator_name: string
  before_status?: string
  after_status?: string
  operation_detail?: string
  remark?: string
  create_time: Date
}

/**
 * 存储生成的报卡数据
 */
export interface GeneratedReportCards {
  cards: ReportCard[]
  assignments: ReportCardAssignment[]
  operationLogs: AssignmentOperationLog[]
  byId: Map<string, ReportCard>
  byAssignStatus: Map<string, ReportCard[]>
  byAuditStatus: Map<string, ReportCard[]>
}

const generatedData: GeneratedReportCards = {
  cards: [],
  assignments: [],
  operationLogs: [],
  byId: new Map(),
  byAssignStatus: new Map(),
  byAuditStatus: new Map()
}

/**
 * 生成报卡数据
 */
async function generateReportCardsInternal(
  diseases: GeneratedDiseases,
  users: GeneratedUsers
): Promise<void> {
  printInfo('正在生成报卡数据...')

  const allDiseaseTypes = Array.from(diseases.types.entries())
  const reporters = users.reporters

  for (let i = 0; i < mockConfig.counts.reportCards; i++) {
    // 随机选择疾病类型
    const [diseaseCode, diseaseTypeId] = randomChoice(allDiseaseTypes)
    const diseaseInfo = diseases.types.get(diseaseCode)

    // 随机选择院区和科室
    const hospital = randomChoice(hospitalAreas)
    const department = randomChoice(hospital.departments)

    // 随机选择报告医生
    const reporter = randomChoice(reporters)

    // 生成患者信息
    const patientName = randomChoice(['张', '李', '王', '刘', '陈', '杨']) +
                       randomChoice(['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋'])

    // 生成就诊单号
    const timestamp = Date.now().toString().slice(-10)
    const inpatientNo = `IP${timestamp}${i.toString().padStart(4, '0')}`
    const outpatientNo = `OP${timestamp}${i.toString().padStart(4, '0')}`

    // 确定报卡状态
    const assignStatus = getDist(mockConfig.distributions.reportCardStatus)
    let auditStatus: string

    // 根据 assign_status 确定 audit_status
    if (assignStatus === 'COMPLETED') {
      auditStatus = getDist(mockConfig.distributions.auditStatus)
    } else if (assignStatus === 'VOID') {
      auditStatus = 'REJECTED'
    } else {
      auditStatus = 'PENDING'
    }

    // 生成时间序列
    const fillDate = randomDate(30)
    const createTime = new Date(fillDate)

    let auditDate: Date | undefined
    let auditor: string | undefined
    let auditorId: string | undefined

    if (assignStatus === 'COMPLETED' || assignStatus === 'IN_PROGRESS') {
      auditDate = randomDateAfter(fillDate, 48)
      const auditorUser = randomChoice([...users.leaders, ...users.auditors])
      auditor = auditorUser.name
      auditorId = auditorUser.id
    }

    const card: ReportCard = {
      id: generateId(),
      hospital_area: hospital.name,
      department,
      diagnosis_name: diseaseInfo?.name || diseaseCode,
      inpatient_no: inpatientNo,
      outpatient_no: outpatientNo,
      name: patientName,
      gender: randomGender() === '男' ? 'MALE' : 'FEMALE',
      age: randomAge(1, 90),
      phone: randomPhone(),
      report_doctor: reporter.name,
      fill_date: fillDate,
      audit_date: auditDate,
      auditor,
      auditor_id: auditorId,
      status: auditStatus === 'PENDING' ? 'PENDING' : auditStatus,
      assign_status: assignStatus,
      audit_status: auditStatus,
      remark: assignStatus === 'VOID' ? '信息不完整，已作废' : undefined,
      create_time: createTime,
      update_time: auditDate || createTime,
      deleted: false
    }

    generatedData.cards.push(card)
    generatedData.byId.set(card.id, card)

    // 按状态分类
    if (!generatedData.byAssignStatus.has(assignStatus)) {
      generatedData.byAssignStatus.set(assignStatus, [])
    }
    generatedData.byAssignStatus.get(assignStatus)!.push(card)

    if (!generatedData.byAuditStatus.has(auditStatus)) {
      generatedData.byAuditStatus.set(auditStatus, [])
    }
    generatedData.byAuditStatus.get(auditStatus)!.push(card)
  }

  // 批量插入
  const columns = ['id', 'hospital_area', 'department', 'diagnosis_name',
                   'inpatient_no', 'outpatient_no', 'name', 'gender', 'age', 'phone',
                   'report_doctor', 'fill_date', 'audit_date', 'auditor', 'auditor_id',
                   'status', 'assign_status', 'audit_status', 'remark',
                   'create_time', 'update_time', 'deleted']

  await batchInsert('report_card', columns, generatedData.cards.map(c => [
    c.id, c.hospital_area, c.department, c.diagnosis_name,
    c.inpatient_no, c.outpatient_no, c.name, c.gender, c.age, c.phone,
    c.report_doctor, c.fill_date, c.audit_date || null, c.auditor || null, c.auditor_id || null,
    c.status, c.assign_status, c.audit_status, c.remark || null,
    c.create_time, c.update_time, c.deleted
  ]))

  printSuccess(`插入报卡 ${generatedData.cards.length} 条`)

  // 打印状态分布
  printInfo('报卡状态分布:')
  for (const [status, cards] of generatedData.byAssignStatus) {
    printInfo(`  - ${status}: ${cards.length} 条`)
  }
}

/**
 * 生成报卡分配记录
 */
async function generateReportCardAssignments(
  users: GeneratedUsers,
  auditGroups: GeneratedAuditGroups
): Promise<void> {
  printInfo('正在生成报卡分配记录...')

  const assigner = randomChoice(users.admins) // 分配人使用管理员

  for (const card of generatedData.cards) {
    // UNASSIGNED 和 VOID 状态的报卡不生成分配记录
    if (card.assign_status === 'UNASSIGNED' || card.assign_status === 'VOID') {
      continue
    }

    const auditGroup = randomChoice(auditGroups.groups)
    const priority = getDist(mockConfig.distributions.priority)

    // 计算时间序列
    const assignTime = new Date(card.fill_date)
    assignTime.setHours(assignTime.getHours() + 2) // 填报后2小时分配

    const deadline = new Date(assignTime)
    deadline.setHours(deadline.getHours() + 24) // 24小时后截止

    let acceptTime: Date | undefined
    let completeTime: Date | undefined
    let status: string

    if (card.assign_status === 'COMPLETED') {
      status = 'COMPLETED'
      acceptTime = new Date(assignTime)
      acceptTime.setHours(acceptTime.getHours() + Math.random() * 4) // 4小时内接单
      completeTime = card.audit_date || new Date(assignTime)
    } else if (card.assign_status === 'IN_PROGRESS') {
      status = 'IN_PROGRESS'
      acceptTime = new Date(assignTime)
      acceptTime.setHours(acceptTime.getHours() + Math.random() * 4)
    } else {
      status = 'PENDING'
    }

    const assignment: ReportCardAssignment = {
      id: generateId(),
      report_card_id: card.id,
      audit_group_id: auditGroup.id,
      assigner_id: assigner.id,
      status,
      assign_time: assignTime,
      deadline: deadline,
      accept_time: acceptTime,
      complete_time: completeTime,
      priority,
      remark: card.assign_status === 'VOID' ? card.remark : undefined,
      reject_reason: card.audit_status === 'REJECTED' ? '资料不全，需要补充' : undefined,
      version: 0,
      create_time: assignTime,
      update_time: completeTime || acceptTime || assignTime,
      deleted: false
    }

    generatedData.assignments.push(assignment)

    // 生成操作日志
    await generateAssignmentOperationLogs(assignment, assigner, auditGroup)
  }

  // 批量插入
  const columns = ['id', 'report_card_id', 'audit_group_id', 'assigner_id',
                   'status', 'assign_time', 'deadline', 'accept_time', 'complete_time',
                   'priority', 'remark', 'reject_reason', 'version',
                   'create_time', 'update_time', 'deleted']

  await batchInsert('report_card_assignment', columns, generatedData.assignments.map(a => [
    a.id, a.report_card_id, a.audit_group_id, a.assigner_id,
    a.status, a.assign_time, a.deadline, a.accept_time || null, a.complete_time || null,
    a.priority, a.remark || null, a.reject_reason || null, a.version,
    a.create_time, a.update_time, a.deleted
  ]))

  printSuccess(`插入报卡分配记录 ${generatedData.assignments.length} 条`)

  // 打印分配状态分布
  const statusCount: Record<string, number> = {}
  for (const a of generatedData.assignments) {
    statusCount[a.status] = (statusCount[a.status] || 0) + 1
  }
  printInfo('分配状态分布:')
  for (const [status, count] of Object.entries(statusCount)) {
    printInfo(`  - ${status}: ${count} 条`)
  }
}

/**
 * 生成分配操作日志
 */
async function generateAssignmentOperationLogs(
  assignment: ReportCardAssignment,
  assigner: any,
  auditGroup: any
): Promise<void> {
  const logs: AssignmentOperationLog[] = []

  // 分配操作
  logs.push({
    id: generateId(),
    assignment_id: assignment.id,
    report_card_id: assignment.report_card_id,
    operation_type: 'ASSIGN',
    operator_id: assignment.assigner_id,
    operator_name: assigner.name,
    before_status: 'UNASSIGNED',
    after_status: 'PENDING',
    operation_detail: JSON.stringify({
      group: auditGroup.group_name,
      priority: assignment.priority
    }),
    remark: '分配报卡到审核组',
    create_time: assignment.assign_time
  })

  // 接单操作
  if (assignment.accept_time) {
    logs.push({
      id: generateId(),
      assignment_id: assignment.id,
      report_card_id: assignment.report_card_id,
      operation_type: 'ACCEPT',
      operator_id: auditGroup.leader_id || assignment.assigner_id,
      operator_name: '审核组长',
      before_status: 'PENDING',
      after_status: 'IN_PROGRESS',
      operation_detail: JSON.stringify({}),
      remark: '审核组接单',
      create_time: assignment.accept_time
    })
  }

  // 完成操作
  if (assignment.complete_time && assignment.status === 'COMPLETED') {
    logs.push({
      id: generateId(),
      assignment_id: assignment.id,
      report_card_id: assignment.report_card_id,
      operation_type: 'COMPLETE',
      operator_id: assignment.assigner_id, // 简化，使用分配人
      operator_name: assigner.name,
      before_status: 'IN_PROGRESS',
      after_status: 'COMPLETED',
      operation_detail: JSON.stringify({}),
      remark: assignment.audit_status === 'APPROVED' ? '审核通过' : '审核驳回',
      create_time: assignment.complete_time
    })
  }

  generatedData.operationLogs.push(...logs)
}

/**
 * 生成报卡数据（主函数）
 */
export async function generateReportCards(
  diseases: GeneratedDiseases,
  users: GeneratedUsers,
  auditGroups: GeneratedAuditGroups,
  clean: boolean = false
): Promise<GeneratedReportCards> {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('第 4 步: 生成报卡数据')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // 检查是否已有数据
  const hasCards = await hasData('report_card')

  if (hasCards) {
    if (clean) {
      printInfo('清理模式：清空现有数据...')
      await truncateTable('assignment_operation_log')
      await truncateTable('report_card_assignment')
      await truncateTable('report_card')
      // 清空后重置数据
      generatedData.cards = []
      generatedData.assignments = []
      generatedData.operationLogs = []
      generatedData.byId.clear()
      generatedData.byAssignStatus.clear()
      generatedData.byAuditStatus.clear()
    } else {
      console.log('⚠ 数据库中已存在报卡数据，跳过生成（使用 --clean 选项可清空并重新生成）')
      await loadExistingReportCards()
      return generatedData
    }
  }

  await generateReportCardsInternal(diseases, users)
  await generateReportCardAssignments(users, auditGroups)

  // 插入操作日志
  if (generatedData.operationLogs.length > 0) {
    const columns = ['id', 'assignment_id', 'report_card_id', 'operation_type',
                     'operator_id', 'operator_name', 'before_status', 'after_status',
                     'operation_detail', 'remark', 'create_time']

    await batchInsert('assignment_operation_log', columns, generatedData.operationLogs.map(l => [
      l.id, l.assignment_id, l.report_card_id, l.operation_type,
      l.operator_id, l.operator_name, l.before_status, l.after_status,
      l.operation_detail, l.remark, l.create_time
    ]))

    printSuccess(`插入分配操作日志 ${generatedData.operationLogs.length} 条`)
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  return generatedData
}

/**
 * 加载现有报卡数据
 */
/**
 * 加载现有报卡数据
 */
async function loadExistingReportCards(): Promise<void> {
  const cards = await query(
    'SELECT * FROM report_card WHERE deleted = 0'
  ) as ReportCard[]

  for (const card of cards) {
    generatedData.cards.push(card)
    generatedData.byId.set(card.id, card)

    if (!generatedData.byAssignStatus.has(card.assign_status)) {
      generatedData.byAssignStatus.set(card.assign_status, [])
    }
    generatedData.byAssignStatus.get(card.assign_status)!.push(card)

    if (!generatedData.byAuditStatus.has(card.audit_status)) {
      generatedData.byAuditStatus.set(card.audit_status, [])
    }
    generatedData.byAuditStatus.get(card.audit_status)!.push(card)
  }

  const assignments = await query(
    'SELECT * FROM report_card_assignment WHERE deleted = 0'
  ) as ReportCardAssignment[]

  generatedData.assignments.push(...assignments)

  printInfo(`已加载现有报卡: ${cards.length} 条, ${assignments.length} 条分配记录`)
}

/**
 * 获取随机报卡
 */
export function getRandomReportCard(assignStatus?: string): ReportCard {
  let cards = generatedData.cards
  if (assignStatus) {
    cards = generatedData.byAssignStatus.get(assignStatus) || cards
  }
  return cards[Math.floor(Math.random() * cards.length)]
}

/**
 * 根据ID获取报卡
 */
export function getReportCardById(id: string): ReportCard | undefined {
  return generatedData.byId.get(id)
}
