import Mock from 'mockjs'
import type {
  MockConfig,
  MockResponse,
  ReportCardDTO,
  RestfulPageResponse,
  CreateReportCardRequest,
  UpdateReportCardRequest,
  ReportCardAssignStatusEnum
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

// Mock 报告卡数据存储
let List: ReportCardDTO[] = []
const count = 200

// 用于映射审核人ID到审核人姓名
const auditorNames: Record<string, string> = {
  'admin-001': '张审核员',
  'auditor-002': '李审核员',
  'auditor-003': '王审核员'
}

// 分配状态枚举
const assignStatuses: ReportCardAssignStatusEnum[] = ['UNASSIGNED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'VOID']

// 审核状态枚举
const auditStatuses = ['PENDING', 'APPROVED', 'REJECTED']

// 用于映射分配人ID到分配人姓名
const assigneeNames: Record<string, string> = {
  'assignee-001': '赵分配员',
  'assignee-002': '钱分配员',
  'assignee-003': '孙分配员'
}

for (let i = 0; i < count; i++) {
  const auditStatus = Mock.Random.pick(auditStatuses)
  const auditorId =
    auditStatus !== 'PENDING' ? Mock.Random.pick(['admin-001', 'auditor-002', 'auditor-003']) : undefined

  // 分配状态: COMPLETED 时 auditStatus 为 APPROVED，其他情况随机
  let assignStatus: ReportCardAssignStatusEnum
  if (auditStatus === 'APPROVED') {
    assignStatus = Mock.Random.pick(['COMPLETED', 'VOID', 'UNASSIGNED'])
  } else {
    assignStatus = Mock.Random.pick(['UNASSIGNED', 'ASSIGNED', 'IN_PROGRESS'])
  }

  // 分配人ID（仅在已分配状态时）
  const assigneeId =
    assignStatus !== 'UNASSIGNED' ? Mock.Random.pick(['assignee-001', 'assignee-002', 'assignee-003']) : undefined

  List.push({
    id: Mock.Random.guid(),
    hospitalArea: Mock.Random.pick(['总院', '分院', '东院区', '西院区']),
    department: Mock.Random.pick(['内科', '外科', '儿科', '妇产科', '骨科', '心内科', '神经科']),
    diagnosisName: Mock.Random.pick(['高血压', '糖尿病', '冠心病', '肺炎', '胃炎', '骨折']),
    inpatientNo: Mock.Random.string('number', 8),
    outpatientNo: Mock.Random.string('number', 8),
    name: Mock.Random.cname(),
    gender: Mock.Random.pick(['MALE', 'FEMALE']),
    age: Mock.Random.integer(1, 100),
    phone: Mock.mock(/^1[3-9]\d{9}$/),
    reportDoctor: Mock.Random.cname(),
    fillDate: Mock.Random.date('yyyy-MM-dd'),
    auditorId,
    auditor: auditorId ? auditorNames[auditorId] : undefined,
    remark: auditStatus === 'REJECTED' ? Mock.Random.csentence(10, 30) : undefined,
    auditStatus: auditStatus as any, // 原 status 改为 auditStatus
    assignStatus, // 新增分配状态
    assigneeId, // 新增分配人ID
    assigneeName: assigneeId ? assigneeNames[assigneeId] : undefined, // 新增分配人姓名
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    auditDate: auditStatus !== 'PENDING' ? Mock.Random.datetime('yyyy-MM-dd HH:mm:ss') : undefined
  } as ReportCardDTO)
}

// ========== RESTful API 处理函数 ==========

/**
 * GET /api/report-cards - 分页查询报告卡列表
 */
const getReportCards = (config: MockConfig): MockResponse<RestfulPageResponse<ReportCardDTO>> => {
  const urlParams = param2Obj(config.url)
  const { keyword, page = 1, size = 10, auditStatus, assignStatus, department, fillDateStart, fillDateEnd } = urlParams

  // 搜索过滤
  let mockList = List
  if (keyword) {
    const kw = keyword.toLowerCase()
    mockList = List.filter(item => {
      return (
        item.name?.toLowerCase().includes(kw) ||
        item.hospitalArea?.toLowerCase().includes(kw) ||
        item.department?.toLowerCase().includes(kw) ||
        item.diagnosisName?.toLowerCase().includes(kw) ||
        item.inpatientNo?.includes(kw) ||
        item.outpatientNo?.includes(kw) ||
        item.phone?.includes(kw)
      )
    })
  }

  // 审核状态过滤 (原 status 改为 auditStatus)
  if (auditStatus) {
    mockList = mockList.filter(item => item.auditStatus === auditStatus)
  }

  // 分配状态过滤 (新增)
  if (assignStatus) {
    mockList = mockList.filter(item => item.assignStatus === assignStatus)
  }

  // 科室过滤
  if (department) {
    mockList = mockList.filter(item => item.department === department)
  }

  // 填报日期范围过滤
  if (fillDateStart) {
    mockList = mockList.filter(item => item.fillDate >= fillDateStart)
  }
  if (fillDateEnd) {
    mockList = mockList.filter(item => item.fillDate <= fillDateEnd)
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
 * GET /api/report-cards/:id - 根据ID获取报告卡
 */
const getReportCardById = (config: MockConfig): MockResponse<ReportCardDTO> => {
  const urlParts = config.url.split('/')
  const id = urlParts[urlParts.length - 1]
  const reportCard = List.find(item => item.id === id)

  if (!reportCard) {
    return {
      code: 404,
      message: 'Report card not found'
    }
  }

  return {
    code: 200,
    message: 'success',
    data: reportCard
  }
}

/**
 * POST /api/report-cards - 创建报告卡
 */
const createReportCard = (config: MockConfig): MockResponse<ReportCardDTO> => {
  const data: CreateReportCardRequest = JSON.parse(config.body || '{}')

  // 验证必填字段
  if (
    !data.hospitalArea ||
    !data.department ||
    !data.name ||
    !data.gender ||
    !data.phone ||
    !data.reportDoctor
  ) {
    return {
      code: 400,
      message: 'Missing required fields'
    }
  }

  const newReportCard: ReportCardDTO = {
    id: Mock.Random.guid(),
    hospitalArea: data.hospitalArea,
    department: data.department,
    diagnosisName: data.diagnosisName,
    inpatientNo: data.inpatientNo,
    outpatientNo: data.outpatientNo,
    name: data.name,
    gender: data.gender,
    age: data.age,
    phone: data.phone,
    reportDoctor: data.reportDoctor,
    fillDate: data.fillDate,
    auditStatus: 'PENDING', // 原 status 改为 auditStatus
    assignStatus: 'UNASSIGNED', // 新增分配状态，默认未分配
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }

  List.unshift(newReportCard)

  return {
    code: 200,
    message: 'Report card created successfully',
    data: newReportCard
  }
}

/**
 * PUT /api/report-cards/:id - 更新报告卡
 */
const updateReportCard = (config: MockConfig): MockResponse<ReportCardDTO> => {
  const urlParts = config.url.split('/')
  const id = urlParts[urlParts.length - 2]
  const data: UpdateReportCardRequest = JSON.parse(config.body || '{}')

  const index = List.findIndex(item => item.id === id)
  if (index === -1) {
    return {
      code: 404,
      message: 'Report card not found'
    }
  }

  // 只允许更新特定字段
  List[index] = {
    ...List[index],
    ...(data.diagnosisName !== undefined && { diagnosisName: data.diagnosisName }),
    ...(data.phone !== undefined && { phone: data.phone }),
    ...(data.reportDoctor !== undefined && { reportDoctor: data.reportDoctor }),
    updateTime: new Date().toISOString()
  }

  return {
    code: 200,
    message: 'Report card updated successfully',
    data: List[index]
  }
}

/**
 * DELETE /api/report-cards/:id - 删除报告卡
 */
const deleteReportCard = (config: MockConfig): MockResponse<{ message: string }> => {
  const urlParts = config.url.split('/')
  const id = urlParts[urlParts.length - 1]
  const index = List.findIndex(item => item.id === id)

  if (index === -1) {
    return {
      code: 404,
      message: 'Report card not found'
    }
  }

  List.splice(index, 1)

  return {
    code: 200,
    message: 'Report card deleted successfully',
    data: { message: 'Report card deleted successfully' }
  }
}

/**
 * PUT /api/report-cards/:id/approve - 审核通过
 */
const approveReportCard = (config: MockConfig): MockResponse<{ message: string }> => {
  const urlParts = config.url.split('/')
  const id = urlParts[urlParts.length - 2]
  const body = JSON.parse(config.body || '{}')
  const { auditorId } = body

  const index = List.findIndex(item => item.id === id)
  if (index === -1) {
    return {
      code: 404,
      message: 'Report card not found'
    }
  }

  List[index] = {
    ...List[index],
    auditStatus: 'APPROVED', // 原 status 改为 auditStatus
    auditorId,
    auditor: auditorNames[auditorId] || '未知审核员',
    auditDate: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    remark: undefined
  }

  return {
    code: 200,
    message: 'Report card approved successfully',
    data: { message: 'Report card approved successfully' }
  }
}

/**
 * PUT /api/report-cards/:id/reject - 审核拒绝
 */
const rejectReportCard = (config: MockConfig): MockResponse<{ message: string }> => {
  const urlParts = config.url.split('/')
  const id = urlParts[urlParts.length - 2]
  const body = JSON.parse(config.body || '{}')
  const { auditorId, remark } = body

  const index = List.findIndex(item => item.id === id)
  if (index === -1) {
    return {
      code: 404,
      message: 'Report card not found'
    }
  }

  List[index] = {
    ...List[index],
    auditStatus: 'REJECTED', // 原 status 改为 auditStatus
    auditorId,
    auditor: auditorNames[auditorId] || '未知审核员',
    remark,
    auditDate: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }

  return {
    code: 200,
    message: 'Report card rejected successfully',
    data: { message: 'Report card rejected successfully' }
  }
}

/**
 * PUT /api/report-cards/:id/withdraw - 撤回审核
 */
const withdrawReportCard = (config: MockConfig): MockResponse<{ message: string }> => {
  const urlParts = config.url.split('/')
  const id = urlParts[urlParts.length - 2]

  const index = List.findIndex(item => item.id === id)
  if (index === -1) {
    return {
      code: 404,
      message: 'Report card not found'
    }
  }

  List[index] = {
    ...List[index],
    auditStatus: 'PENDING', // 原 status 改为 auditStatus
    auditorId: undefined,
    auditor: undefined,
    remark: undefined,
    auditDate: undefined,
    updateTime: new Date().toISOString()
  }

  return {
    code: 200,
    message: 'Report card withdrawn successfully',
    data: { message: 'Report card withdrawn successfully' }
  }
}

/**
 * GET /api/report-cards/pending - 获取待审核列表
 */
const getPendingReportCards = (config: MockConfig): MockResponse<ReportCardDTO[]> => {
  const pendingCards = List.filter(item => item.auditStatus === 'PENDING')

  return {
    code: 200,
    message: 'success',
    data: pendingCards
  }
}

/**
 * GET /api/report-cards/statistics - 获取统计信息
 */
const getReportCardStatistics = (
  config: MockConfig
): MockResponse<{
  PENDING: number
  APPROVED: number
  REJECTED: number
}> => {
  const statistics = {
    PENDING: List.filter(item => item.auditStatus === 'PENDING').length,
    APPROVED: List.filter(item => item.auditStatus === 'APPROVED').length,
    REJECTED: List.filter(item => item.auditStatus === 'REJECTED').length
  }

  return {
    code: 200,
    message: 'success',
    data: statistics
  }
}

/**
 * GET /api/report-cards/assign-status/:assignStatus - 根据分配状态查询报告卡列表 (新增)
 */
const getReportCardsByAssignStatus = (
  config: MockConfig
): MockResponse<RestfulPageResponse<ReportCardDTO>> => {
  const urlParts = config.url.split('/')
  const assignStatus = urlParts[urlParts.length - 1]
  const urlParams = param2Obj(config.url)
  const { keyword, page = 1, size = 10, auditStatus, department, fillDateStart, fillDateEnd } = urlParams

  // 按分配状态过滤
  let mockList = List.filter(item => item.assignStatus === assignStatus)

  // 搜索过滤
  if (keyword) {
    const kw = keyword.toLowerCase()
    mockList = mockList.filter(item => {
      return (
        item.name?.toLowerCase().includes(kw) ||
        item.hospitalArea?.toLowerCase().includes(kw) ||
        item.department?.toLowerCase().includes(kw) ||
        item.diagnosisName?.toLowerCase().includes(kw) ||
        item.inpatientNo?.includes(kw) ||
        item.outpatientNo?.includes(kw) ||
        item.phone?.includes(kw)
      )
    })
  }

  // 审核状态过滤
  if (auditStatus) {
    mockList = mockList.filter(item => item.auditStatus === auditStatus)
  }

  // 科室过滤
  if (department) {
    mockList = mockList.filter(item => item.department === department)
  }

  // 填报日期范围过滤
  if (fillDateStart) {
    mockList = mockList.filter(item => item.fillDate >= fillDateStart)
  }
  if (fillDateEnd) {
    mockList = mockList.filter(item => item.fillDate <= fillDateEnd)
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

export default {
  getReportCards,
  getReportCardById,
  createReportCard,
  updateReportCard,
  deleteReportCard,
  approveReportCard,
  rejectReportCard,
  withdrawReportCard,
  getPendingReportCards,
  getReportCardStatistics,
  getReportCardsByAssignStatus
}
