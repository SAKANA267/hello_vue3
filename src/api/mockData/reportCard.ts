import Mock from 'mockjs'
import type {
  MockConfig,
  MockResponse,
  ReportCardDTO,
  RestfulPageResponse,
  CreateReportCardRequest,
  UpdateReportCardRequest,
  AssignStatus,
  AuditStatus
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

// Mock 报告卡数据存储（含完整嵌套对象，模拟时内部使用）
interface MockReportCard extends ReportCardDTO {
  _assignStatus?: AssignStatus
  _auditorId?: string
  _remark?: string
}

let List: MockReportCard[] = []
const count = 200

const auditorNames: Record<string, string> = {
  'admin-001': '张审核员',
  'auditor-002': '李审核员',
  'auditor-003': '王审核员'
}

const assigneeNames: Record<string, string> = {
  'assignee-001': '赵分配员',
  'assignee-002': '钱分配员',
  'assignee-003': '孙分配员'
}

const diseases = ['高血压', '糖尿病', '冠心病', '肺炎', '胃炎', '骨折']

for (let i = 0; i < count; i++) {
  const auditStatus = Mock.Random.pick(['PENDING', 'APPROVED', 'REJECTED']) as AuditStatus
  const auditorId =
    auditStatus !== 'PENDING' ? Mock.Random.pick(['admin-001', 'auditor-002', 'auditor-003']) : undefined
  const patientName = Mock.Random.cname()
  const diseaseName = Mock.Random.pick(diseases)
  const doctorName = Mock.Random.cname()
  const gender = Mock.Random.pick(['MALE', 'FEMALE']) as 'MALE' | 'FEMALE'
  const age = Mock.Random.integer(1, 100)
  const phone = Mock.mock(/^1[3-9]\d{9}$/)

  let assignStatus: AssignStatus
  if (auditStatus === 'APPROVED') {
    assignStatus = Mock.Random.pick(['COMPLETED', 'VOID', 'UNASSIGNED']) as AssignStatus
  } else {
    assignStatus = Mock.Random.pick(['UNASSIGNED', 'ASSIGNED', 'IN_PROGRESS']) as AssignStatus
  }
  const assigneeId =
    assignStatus !== 'UNASSIGNED' ? Mock.Random.pick(['assignee-001', 'assignee-002', 'assignee-003']) : undefined

  List.push({
    id: Mock.Random.guid(),
    cardNumber: Mock.Random.string('upper', 3) + '-' + Mock.Random.string('number', 4),
    reportCategory: Mock.Random.pick(['INITIAL', 'CORRECTION']) as 'INITIAL' | 'CORRECTION',
    reportStatus: Mock.Random.pick(['REPORTED', 'UNREPORTED']) as 'REPORTED' | 'UNREPORTED',
    hospitalArea: Mock.Random.pick(['总院', '分院', '东院区', '西院区']),
    department: Mock.Random.pick(['内科', '外科', '儿科', '妇产科', '骨科', '心内科', '神经科']),
    inpatientNo: Mock.Random.string('number', 8),
    outpatientNo: Mock.Random.string('number', 8),
    doctorName,
    fillDate: Mock.Random.date('yyyy-MM-dd'),
    patientName,
    diseaseName,
    auditStatus,
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    // 列表时嵌套对象为 null
    patientInfo: null,
    diagnosisInfo: null,
    auditInfo: null,
    // 内部字段，用于 mock 过滤
    _assignStatus: assignStatus,
    _auditorId: auditorId,
    _remark: auditStatus === 'REJECTED' ? Mock.Random.csentence(10, 30) : undefined
  })
}

/** 根据 ID 获取详情（填充嵌套对象） */
function getDetailById(id: string): ReportCardDTO | undefined {
  const item = List.find(i => i.id === id)
  if (!item) return undefined

  const patientInfo = {
    id: Mock.Random.guid(),
    patientName: item.patientName,
    idCard: Mock.mock('@id'),
    birthday: Mock.Random.date('yyyy-MM-dd'),
    gender: item.reportCategory === 'INITIAL' ? 'MALE' as const : 'FEMALE' as const,
    age: Mock.Random.integer(1, 100),
    phone: Mock.mock(/^1[3-9]\d{9}$/),
    parentName: null,
    workUnit: null,
    addressType: Mock.Random.pick(['COUNTY', 'CITY', 'PROVINCE', 'OTHER_PROVINCE']) as 'COUNTY' | 'CITY' | 'PROVINCE' | 'OTHER_PROVINCE',
    detailAddress: Mock.Random.county(true)
  }

  const diagnosisInfo = {
    id: Mock.Random.guid(),
    diseaseName: item.diseaseName,
    diagnosisCode: Mock.Random.string('upper', 3) + '.' + Mock.Random.string('number', 1),
    patientBelong: Mock.Random.pick(['LOCAL', 'NON_LOCAL']),
    crowdCategories: [Mock.Random.pick(['散居儿童', '学生', '工人', '农民', '其他'])],
    caseType: Mock.Random.pick(['SUSPECTED', 'CLINICAL', 'CONFIRMED', 'PATHOGEN']),
    caseAttribute: Mock.Random.pick(['ACUTE', 'CHRONIC']),
    onsetDate: Mock.Random.date('yyyy-MM-dd'),
    diagnosisDate: item.fillDate,
    deathDate: null,
    remark: item._remark || null
  }

  const auditInfo = {
    id: Mock.Random.guid(),
    auditorId: item._auditorId || null,
    auditorName: item._auditorId ? auditorNames[item._auditorId] || null : null,
    auditStatus: item.auditStatus,
    auditDate: item.auditStatus !== 'PENDING' ? Mock.Random.datetime('yyyy-MM-dd HH:mm:ss') : null,
    rejectReason: item.auditStatus === 'REJECTED' ? item._remark || null : null,
    assignStatus: item._assignStatus || 'UNASSIGNED',
    assigneeId: null
  }

  return {
    ...item,
    patientInfo,
    diagnosisInfo,
    auditInfo
  }
}

// ========== RESTful API 处理函数 ==========

/** GET /api/report-cards - 分页查询报告卡列表 */
const getReportCards = (config: MockConfig): MockResponse<RestfulPageResponse<ReportCardDTO>> => {
  const urlParams = param2Obj(config.url)
  const { keyword, page = 1, size = 10, status, assignStatus, department, startTime, endTime } = urlParams

  let mockList = List
  if (keyword) {
    const kw = keyword.toLowerCase()
    mockList = mockList.filter(item => {
      return (
        item.patientName?.toLowerCase().includes(kw) ||
        item.hospitalArea?.toLowerCase().includes(kw) ||
        item.department?.toLowerCase().includes(kw) ||
        item.diseaseName?.toLowerCase().includes(kw) ||
        item.inpatientNo?.includes(kw) ||
        item.outpatientNo?.includes(kw)
      )
    })
  }

  if (status) {
    mockList = mockList.filter(item => item.auditStatus === status)
  }

  if (assignStatus) {
    mockList = mockList.filter(item => item._assignStatus === assignStatus)
  }

  if (department) {
    mockList = mockList.filter(item => item.department === department)
  }

  if (startTime) {
    mockList = mockList.filter(item => item.fillDate >= startTime.split('T')[0])
  }
  if (endTime) {
    mockList = mockList.filter(item => item.fillDate <= endTime.split('T')[0])
  }

  const pageNum = Number(page) || 1
  const pageSize = Number(size) || 10
  const start = (pageNum - 1) * pageSize
  const records = mockList.slice(start, start + pageSize)

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

/** GET /api/report-cards/:id - 根据ID获取报告卡详情 */
const getReportCardById = (config: MockConfig): MockResponse<ReportCardDTO> => {
  const urlParts = config.url.split('/')
  const id = urlParts[urlParts.length - 1]
  const detail = getDetailById(id)

  if (!detail) {
    return { code: 404, message: 'Report card not found' }
  }

  return { code: 200, message: 'success', data: detail }
}

/** POST /api/report-cards - 创建报告卡 */
const createReportCard = (config: MockConfig): MockResponse<ReportCardDTO> => {
  const data: CreateReportCardRequest = JSON.parse(config.body || '{}')

  if (!data.hospitalArea || !data.department || !data.patientInfo?.patientName || !data.doctorName) {
    return { code: 400, message: 'Missing required fields' }
  }

  const newItem: MockReportCard = {
    id: Mock.Random.guid(),
    cardNumber: Mock.Random.string('upper', 3) + '-' + Mock.Random.string('number', 4),
    reportCategory: data.reportCategory || 'INITIAL',
    reportStatus: 'UNREPORTED',
    hospitalArea: data.hospitalArea,
    department: data.department,
    inpatientNo: data.inpatientNo || null,
    outpatientNo: data.outpatientNo || null,
    doctorName: data.doctorName,
    fillDate: data.fillDate,
    patientName: data.patientInfo.patientName,
    diseaseName: data.diagnosisInfo.diseaseName,
    auditStatus: 'PENDING',
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    patientInfo: null,
    diagnosisInfo: null,
    auditInfo: null,
    _assignStatus: 'UNASSIGNED'
  }

  List.unshift(newItem)

  return { code: 200, message: 'Report card created successfully', data: newItem }
}

/** PUT /api/report-cards/:id - 更新报告卡 */
const updateReportCard = (config: MockConfig): MockResponse<ReportCardDTO> => {
  const urlParts = config.url.split('/')
  const id = urlParts[urlParts.length - 2]
  const data: UpdateReportCardRequest = JSON.parse(config.body || '{}')

  const index = List.findIndex(item => item.id === id)
  if (index === -1) {
    return { code: 404, message: 'Report card not found' }
  }

  if (data.doctorName !== undefined) List[index].doctorName = data.doctorName
  if (data.reportCategory !== undefined) List[index].reportCategory = data.reportCategory
  if (data.reportStatus !== undefined) List[index].reportStatus = data.reportStatus
  if (data.diagnosisInfo?.diseaseName) List[index].diseaseName = data.diagnosisInfo.diseaseName
  List[index].updateTime = new Date().toISOString()

  return { code: 200, message: 'Report card updated successfully', data: List[index] }
}

/** DELETE /api/report-cards/:id - 删除报告卡 */
const deleteReportCard = (config: MockConfig): MockResponse<{ message: string }> => {
  const urlParts = config.url.split('/')
  const id = urlParts[urlParts.length - 1]
  const index = List.findIndex(item => item.id === id)

  if (index === -1) {
    return { code: 404, message: 'Report card not found' }
  }

  List.splice(index, 1)

  return { code: 200, message: 'Report card deleted successfully', data: { message: 'Report card deleted successfully' } }
}

/** PUT /api/report-cards/:id/approve - 审核通过 */
const approveReportCard = (config: MockConfig): MockResponse<{ message: string }> => {
  const urlParts = config.url.split('/')
  const id = urlParts[urlParts.length - 2]
  const { auditorId } = JSON.parse(config.body || '{}')

  const index = List.findIndex(item => item.id === id)
  if (index === -1) {
    return { code: 404, message: 'Report card not found' }
  }

  List[index].auditStatus = 'APPROVED'
  List[index]._auditorId = auditorId
  List[index].updateTime = new Date().toISOString()

  return { code: 200, message: 'Report card approved successfully', data: { message: 'Report card approved successfully' } }
}

/** PUT /api/report-cards/:id/reject - 审核拒绝 */
const rejectReportCard = (config: MockConfig): MockResponse<{ message: string }> => {
  const urlParts = config.url.split('/')
  const id = urlParts[urlParts.length - 2]
  const { auditorId, remark } = JSON.parse(config.body || '{}')

  const index = List.findIndex(item => item.id === id)
  if (index === -1) {
    return { code: 404, message: 'Report card not found' }
  }

  List[index].auditStatus = 'REJECTED'
  List[index]._auditorId = auditorId
  List[index]._remark = remark
  List[index].updateTime = new Date().toISOString()

  return { code: 200, message: 'Report card rejected successfully', data: { message: 'Report card rejected successfully' } }
}

/** PUT /api/report-cards/:id/withdraw - 撤回审核 */
const withdrawReportCard = (config: MockConfig): MockResponse<{ message: string }> => {
  const urlParts = config.url.split('/')
  const id = urlParts[urlParts.length - 2]

  const index = List.findIndex(item => item.id === id)
  if (index === -1) {
    return { code: 404, message: 'Report card not found' }
  }

  List[index].auditStatus = 'PENDING'
  List[index]._auditorId = undefined
  List[index]._remark = undefined
  List[index].updateTime = new Date().toISOString()

  return { code: 200, message: 'Report card withdrawn successfully', data: { message: 'Report card withdrawn successfully' } }
}

/** GET /api/report-cards/pending - 获取待审核列表 */
const getPendingReportCards = (config: MockConfig): MockResponse<ReportCardDTO[]> => {
  const pendingCards = List.filter(item => item.auditStatus === 'PENDING')

  return { code: 200, message: 'success', data: pendingCards }
}

/** GET /api/report-cards/statistics - 获取统计信息 */
const getReportCardStatistics = (
  config: MockConfig
): MockResponse<{ PENDING: number; APPROVED: number; REJECTED: number }> => {
  const statistics = {
    PENDING: List.filter(item => item.auditStatus === 'PENDING').length,
    APPROVED: List.filter(item => item.auditStatus === 'APPROVED').length,
    REJECTED: List.filter(item => item.auditStatus === 'REJECTED').length
  }

  return { code: 200, message: 'success', data: statistics }
}

/** GET /api/report-cards/assign-status/:assignStatus - 根据分配状态查询 */
const getReportCardsByAssignStatus = (
  config: MockConfig
): MockResponse<RestfulPageResponse<ReportCardDTO>> => {
  const urlParts = config.url.split('/')
  const assignStatus = urlParts[urlParts.length - 1]
  const urlParams = param2Obj(config.url)
  const { keyword, page = 1, size = 10, status, department, startTime, endTime } = urlParams

  let mockList = List.filter(item => item._assignStatus === assignStatus)

  if (keyword) {
    const kw = keyword.toLowerCase()
    mockList = mockList.filter(item => {
      return (
        item.patientName?.toLowerCase().includes(kw) ||
        item.hospitalArea?.toLowerCase().includes(kw) ||
        item.department?.toLowerCase().includes(kw) ||
        item.diseaseName?.toLowerCase().includes(kw) ||
        item.inpatientNo?.includes(kw)
      )
    })
  }

  if (status) {
    mockList = mockList.filter(item => item.auditStatus === status)
  }

  if (department) {
    mockList = mockList.filter(item => item.department === department)
  }

  if (startTime) {
    mockList = mockList.filter(item => item.fillDate >= startTime.split('T')[0])
  }
  if (endTime) {
    mockList = mockList.filter(item => item.fillDate <= endTime.split('T')[0])
  }

  const pageNum = Number(page) || 1
  const pageSize = Number(size) || 10
  const start = (pageNum - 1) * pageSize
  const records = mockList.slice(start, start + pageSize)

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
