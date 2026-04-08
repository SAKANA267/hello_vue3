/**
 * Task Assignment Mock Data
 * 任务分配模块模拟数据
 * @author: SAKANA267
 * @since: 2026-04-07
 */

import type {
  AssignmentDTO,
  AssignmentRuleDTO,
  WorkStatsDTO,
  AssignmentLogDTO,
  AssignmentStatusEnum,
  AssignmentPriorityEnum
} from '@/api/types'

// 状态映射
const statusMap: Record<string, { value: AssignmentStatusEnum; label: string; tagType: string }> = {
  '待处理': { value: 'PENDING', label: '待处理', tagType: 'warning' },
  '处理中': { value: 'IN_PROGRESS', label: '处理中', tagType: 'primary' },
  '已完成': { value: 'COMPLETED', label: '已完成', tagType: 'success' },
  '已取消': { value: 'CANCELLED', label: '已取消', tagType: 'info' }
}

// 优先级映射
const priorityMap: Record<string, { value: AssignmentPriorityEnum; label: string; tagType: string }> = {
  '低': { value: 'LOW', label: '低', tagType: 'info' },
  '普通': { value: 'NORMAL', label: '普通', tagType: '' },
  '高': { value: 'HIGH', label: '高', tagType: 'warning' },
  '紧急': { value: 'URGENT', label: '紧急', tagType: 'danger' }
}

// 生成任务ID
let assignmentIdCounter = 1
const generateAssignmentId = () => `ASSIGN${String(assignmentIdCounter++).padStart(6, '0')}`

// 生成规则ID
let ruleIdCounter = 1
const generateRuleId = () => `RULE${String(ruleIdCounter++).padStart(6, '0')}`

// 生成日志ID
let logIdCounter = 1
const generateLogId = () => `LOG${String(logIdCounter++).padStart(6, '0')}`

/** 待分配的报卡列表（来自报卡管理模块） */
export const pendingReportCards = [
  {
    id: 'RC20260001',
    inpatientNo: 'IP20260101',
    outpatientNo: 'OP20260101',
    patientName: '张某某',
    diagnosisName: '新冠肺炎',
    hospitalArea: '总院',
    department: '感染科',
    diseaseCategory: '呼吸道传染病'
  },
  {
    id: 'RC20260002',
    inpatientNo: 'IP20260102',
    outpatientNo: 'OP20260102',
    patientName: '李某某',
    diagnosisName: '流感',
    hospitalArea: '东院',
    department: '呼吸内科',
    diseaseCategory: '呼吸道传染病'
  },
  {
    id: 'RC20260003',
    inpatientNo: 'IP20260103',
    outpatientNo: 'OP20260103',
    patientName: '王某某',
    diagnosisName: '结核病',
    hospitalArea: '南院',
    department: '感染科',
    diseaseCategory: '呼吸道传染病'
  },
  {
    id: 'RC20260004',
    inpatientNo: 'IP20260104',
    outpatientNo: 'OP20260104',
    patientName: '赵某某',
    diagnosisName: '手足口病',
    hospitalArea: '北院',
    department: '儿科',
    diseaseCategory: '肠道传染病'
  },
  {
    id: 'RC20260005',
    inpatientNo: 'IP20260105',
    outpatientNo: 'OP20260105',
    patientName: '刘某某',
    diagnosisName: '病毒性肝炎',
    hospitalArea: '总院',
    department: '感染科',
    diseaseCategory: '血液传染病'
  }
]

/** 已分配任务列表 */
export const assignments: AssignmentDTO[] = [
  {
    id: generateAssignmentId(),
    reportCardId: 'RC20250101',
    auditGroupId: 'AG001',
    auditGroupName: '第一审核组',
    assignerId: 'U001',
    assignerName: '管理员',
    accepterId: 'U002',
    accepterName: '张审核员',
    status: 'IN_PROGRESS',
    statusDescription: '处理中',
    priority: 'NORMAL',
    priorityDescription: '普通',
    assignTime: '2026-04-06T10:00:00',
    acceptTime: '2026-04-06T10:30:00',
    deadline: '2026-04-07T18:00:00',
    reportCardInpatientNo: 'IP20250101',
    reportCardPatientName: '陈某某',
    reportCardDiagnosisName: '新冠肺炎',
    version: 1
  },
  {
    id: generateAssignmentId(),
    reportCardId: 'RC20250102',
    auditGroupId: 'AG002',
    auditGroupName: '第二审核组',
    assignerId: 'U001',
    assignerName: '管理员',
    status: 'PENDING',
    statusDescription: '待处理',
    priority: 'HIGH',
    priorityDescription: '高',
    assignTime: '2026-04-06T14:00:00',
    deadline: '2026-04-07T12:00:00',
    reportCardInpatientNo: 'IP20250102',
    reportCardPatientName: '周某某',
    reportCardDiagnosisName: '流感',
    version: 0
  },
  {
    id: generateAssignmentId(),
    reportCardId: 'RC20250103',
    auditGroupId: 'AG001',
    auditGroupName: '第一审核组',
    assignerId: 'U001',
    assignerName: '管理员',
    accepterId: 'U003',
    accepterName: '李审核员',
    status: 'COMPLETED',
    statusDescription: '已完成',
    priority: 'NORMAL',
    priorityDescription: '普通',
    assignTime: '2026-04-05T09:00:00',
    acceptTime: '2026-04-05T09:15:00',
    completeTime: '2026-04-05T11:30:00',
    reportCardInpatientNo: 'IP20250103',
    reportCardPatientName: '吴某某',
    reportCardDiagnosisName: '结核病',
    remark: '审核通过',
    version: 2
  },
  {
    id: generateAssignmentId(),
    reportCardId: 'RC20250104',
    auditGroupId: 'AG003',
    auditGroupName: '第三审核组',
    assignerId: 'U001',
    assignerName: '管理员',
    status: 'CANCELLED',
    statusDescription: '已取消',
    priority: 'LOW',
    priorityDescription: '低',
    assignTime: '2026-04-05T16:00:00',
    reportCardInpatientNo: 'IP20250104',
    reportCardPatientName: '孙某某',
    reportCardDiagnosisName: '手足口病',
    remark: '信息不全，退回重填',
    version: 1
  },
  {
    id: generateAssignmentId(),
    reportCardId: 'RC20250105',
    auditGroupId: 'AG002',
    auditGroupName: '第二审核组',
    assignerId: 'U001',
    assignerName: '管理员',
    accepterId: 'U004',
    accepterName: '王审核员',
    status: 'IN_PROGRESS',
    statusDescription: '处理中',
    priority: 'URGENT',
    priorityDescription: '紧急',
    assignTime: '2026-04-06T08:00:00',
    acceptTime: '2026-04-06T08:10:00',
    deadline: '2026-04-06T18:00:00',
    reportCardInpatientNo: 'IP20250105',
    reportCardPatientName: '郑某某',
    reportCardDiagnosisName: '病毒性肝炎',
    version: 1
  }
]

/** 分配规则列表 */
export const assignmentRules: AssignmentRuleDTO[] = [
  {
    id: generateRuleId(),
    ruleName: '呼吸道传染病-总院-感染科',
    ruleCode: 'RESP_GI_MAIN',
    diseaseCategory: '呼吸道传染病',
    hospitalArea: '总院',
    department: '感染科',
    assignStrategy: 'LEAST_TASKS',
    assignStrategyDescription: '最少任务优先',
    targetGroupId: 'AG001',
    targetGroupName: '第一审核组',
    priority: 'NORMAL',
    priorityDescription: '普通',
    deadlineHours: 24,
    status: 'ACTIVE',
    statusDescription: '启用',
    ruleOrder: 1,
    createTime: '2026-01-01T00:00:00'
  },
  {
    id: generateRuleId(),
    ruleName: '呼吸道传染病-东院-呼吸内科',
    ruleCode: 'RESP_RD_EAST',
    diseaseCategory: '呼吸道传染病',
    hospitalArea: '东院',
    department: '呼吸内科',
    assignStrategy: 'ROUND_ROBIN',
    assignStrategyDescription: '轮询分配',
    targetGroupId: 'AG002',
    targetGroupName: '第二审核组',
    priority: 'NORMAL',
    priorityDescription: '普通',
    deadlineHours: 24,
    status: 'ACTIVE',
    statusDescription: '启用',
    ruleOrder: 2,
    createTime: '2026-01-01T00:00:00'
  },
  {
    id: generateRuleId(),
    ruleName: '儿童传染病-儿科',
    ruleCode: 'CHILD_PEDIATRICS',
    diseaseCategory: '肠道传染病',
    department: '儿科',
    assignStrategy: 'LEAST_TASKS',
    assignStrategyDescription: '最少任务优先',
    priority: 'HIGH',
    priorityDescription: '高',
    deadlineHours: 12,
    status: 'ACTIVE',
    statusDescription: '启用',
    ruleOrder: 3,
    createTime: '2026-01-01T00:00:00'
  },
  {
    id: generateRuleId(),
    ruleName: '紧急报卡-手动分配',
    ruleCode: 'URGENT_MANUAL',
    assignStrategy: 'MANUAL',
    assignStrategyDescription: '手动指定',
    priority: 'URGENT',
    priorityDescription: '紧急',
    deadlineHours: 4,
    status: 'ACTIVE',
    statusDescription: '启用',
    ruleOrder: 0,
    createTime: '2026-01-01T00:00:00'
  },
  {
    id: generateRuleId(),
    ruleName: '备用规则-组长分配',
    ruleCode: 'BACKUP_LEADER',
    assignStrategy: 'LEADER',
    assignStrategyDescription: '组长分配',
    priority: 'NORMAL',
    priorityDescription: '普通',
    deadlineHours: 48,
    status: 'INACTIVE',
    statusDescription: '停用',
    ruleOrder: 99,
    createTime: '2026-01-01T00:00:00'
  }
]

/** 审核组工作统计 */
export const workStats: WorkStatsDTO[] = [
  {
    id: 'WS001',
    auditGroupId: 'AG001',
    auditGroupName: '第一审核组',
    auditGroupCode: 'GROUP001',
    totalAssigned: 45,
    totalCompleted: 38,
    totalCancelled: 2,
    pendingCount: 3,
    inProgressCount: 2,
    currentTaskCount: 5,
    avgProcessTime: 85,
    lastTaskTime: '2026-04-06T15:30:00'
  },
  {
    id: 'WS002',
    auditGroupId: 'AG002',
    auditGroupName: '第二审核组',
    auditGroupCode: 'GROUP002',
    totalAssigned: 52,
    totalCompleted: 45,
    totalCancelled: 3,
    pendingCount: 2,
    inProgressCount: 2,
    currentTaskCount: 4,
    avgProcessTime: 92,
    lastTaskTime: '2026-04-06T16:00:00'
  },
  {
    id: 'WS003',
    auditGroupId: 'AG003',
    auditGroupName: '第三审核组',
    auditGroupCode: 'GROUP003',
    totalAssigned: 38,
    totalCompleted: 35,
    totalCancelled: 1,
    pendingCount: 1,
    inProgressCount: 1,
    currentTaskCount: 2,
    avgProcessTime: 78,
    lastTaskTime: '2026-04-06T14:45:00'
  },
  {
    id: 'WS004',
    auditGroupId: 'AG004',
    auditGroupName: '第四审核组',
    auditGroupCode: 'GROUP004',
    totalAssigned: 28,
    totalCompleted: 25,
    totalCancelled: 0,
    pendingCount: 2,
    inProgressCount: 1,
    currentTaskCount: 3,
    avgProcessTime: 88,
    lastTaskTime: '2026-04-06T15:15:00'
  }
]

/** 操作日志示例 */
export const assignmentLogs: AssignmentLogDTO[] = [
  {
    id: generateLogId(),
    assignmentId: 'ASSIGN000001',
    reportCardId: 'RC20250101',
    operationType: 'ASSIGN',
    operationTypeDescription: '分配',
    operatorId: 'U001',
    operatorName: '管理员',
    afterStatus: 'PENDING',
    createTime: '2026-04-06T10:00:00'
  },
  {
    id: generateLogId(),
    assignmentId: 'ASSIGN000001',
    reportCardId: 'RC20250101',
    operationType: 'ACCEPT',
    operationTypeDescription: '接单',
    operatorId: 'U002',
    operatorName: '张审核员',
    beforeStatus: 'PENDING',
    afterStatus: 'IN_PROGRESS',
    createTime: '2026-04-06T10:30:00'
  },
  {
    id: generateLogId(),
    assignmentId: 'ASSIGN000003',
    reportCardId: 'RC20250103',
    operationType: 'ASSIGN',
    operationTypeDescription: '分配',
    operatorId: 'U001',
    operatorName: '管理员',
    afterStatus: 'PENDING',
    createTime: '2026-04-05T09:00:00'
  },
  {
    id: generateLogId(),
    assignmentId: 'ASSIGN000003',
    reportCardId: 'RC20250103',
    operationType: 'ACCEPT',
    operationTypeDescription: '接单',
    operatorId: 'U003',
    operatorName: '李审核员',
    beforeStatus: 'PENDING',
    afterStatus: 'IN_PROGRESS',
    createTime: '2026-04-05T09:15:00'
  },
  {
    id: generateLogId(),
    assignmentId: 'ASSIGN000003',
    reportCardId: 'RC20250103',
    operationType: 'COMPLETE',
    operationTypeDescription: '完成',
    operatorId: 'U003',
    operatorName: '李审核员',
    beforeStatus: 'IN_PROGRESS',
    afterStatus: 'COMPLETED',
    createTime: '2026-04-05T11:30:00'
  }
]

// 导出辅助函数
export { statusMap, priorityMap }

// 分配策略选项
export const assignStrategyOptions = [
  { label: '轮询分配', value: 'ROUND_ROBIN' },
  { label: '最少任务优先', value: 'LEAST_TASKS' },
  { label: '手动指定', value: 'MANUAL' },
  { label: '组长分配', value: 'LEADER' }
]

// 优先级选项
export const priorityOptions = [
  { label: '低', value: 'LOW' },
  { label: '普通', value: 'NORMAL' },
  { label: '高', value: 'HIGH' },
  { label: '紧急', value: 'URGENT' }
]

// 任务状态选项
export const statusOptions = [
  { label: '待处理', value: 'PENDING' },
  { label: '处理中', value: 'IN_PROGRESS' },
  { label: '已完成', value: 'COMPLETED' },
  { label: '已取消', value: 'CANCELLED' }
]
