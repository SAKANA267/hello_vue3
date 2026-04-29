import type { ReportCardDTO } from '@/api/types'

// ============== 枚举映射常量 ==============

/** 后端性别枚举 → 前端显示 */
const GENDER_MAP: Record<string, string> = {
  MALE: '男',
  FEMALE: '女'
}

/** 后端审核状态枚举 → 前端显示 */
const AUDIT_STATUS_MAP: Record<string, string> = {
  PENDING: '待审核',
  APPROVED: '已审核',
  REJECTED: '审核不通过'
}

/** 后端分配状态枚举 → 前端显示 */
const ASSIGN_STATUS_MAP: Record<string, string> = {
  UNASSIGNED: '未分配',
  ASSIGNED: '已分配',
  IN_PROGRESS: '处理中',
  COMPLETED: '已完成',
  VOID: '已作废'
}

/** 后端报卡类别枚举 → 前端显示 */
const REPORT_CATEGORY_MAP: Record<string, string> = {
  INITIAL: '初次报告',
  CORRECTION: '订正报告'
}

/** 后端上报状态枚举 → 前端显示 */
const REPORT_STATUS_MAP: Record<string, string> = {
  REPORTED: '已上报',
  UNREPORTED: '未上报'
}

/** 后端地址类型枚举 → 前端显示 */
const ADDRESS_TYPE_MAP: Record<string, string> = {
  COUNTY: '本县(区)',
  CITY: '本市其他县(区)',
  PROVINCE: '本省其他市',
  OTHER_PROVINCE: '外省',
  HK_MACAO_TAIWAN: '港澳台',
  FOREIGN: '外籍'
}

/** 后端病人属于枚举 → 前端显示 */
const PATIENT_BELONG_MAP: Record<string, string> = {
  LOCAL: '本地病人',
  NON_LOCAL: '外来病人'
}

/** 后端病例分类枚举 → 前端显示 */
const CASE_TYPE_MAP: Record<string, string> = {
  SUSPECTED: '疑似病例',
  CLINICAL: '临床诊断',
  CONFIRMED: '确诊病例',
  PATHOGEN: '病原携带者'
}

/** 后端病例属性枚举 → 前端显示 */
const CASE_ATTRIBUTE_MAP: Record<string, string> = {
  ACUTE: '急性',
  CHRONIC: '慢性'
}

/** 后端上报状态枚举 → 前端显示 */
const UPLOAD_STATUS_MAP: Record<string, string> = {
  NOT_UPLOADED: '未上报',
  UPLOADING: '上报中',
  UPLOADED: '已上报',
  UPLOAD_FAILED: '上报失败'
}

// ============== 反向映射 ==============

const GENDER_REVERSE = Object.fromEntries(Object.entries(GENDER_MAP).map(([k, v]) => [v, k]))
const AUDIT_STATUS_REVERSE = Object.fromEntries(Object.entries(AUDIT_STATUS_MAP).map(([k, v]) => [v, k]))
const ASSIGN_STATUS_REVERSE = Object.fromEntries(Object.entries(ASSIGN_STATUS_MAP).map(([k, v]) => [v, k]))
const UPLOAD_STATUS_REVERSE = Object.fromEntries(Object.entries(UPLOAD_STATUS_MAP).map(([k, v]) => [v, k]))
const REPORT_CATEGORY_REVERSE = Object.fromEntries(Object.entries(REPORT_CATEGORY_MAP).map(([k, v]) => [v, k]))
const REPORT_STATUS_REVERSE = Object.fromEntries(Object.entries(REPORT_STATUS_MAP).map(([k, v]) => [v, k]))
const ADDRESS_TYPE_REVERSE = Object.fromEntries(Object.entries(ADDRESS_TYPE_MAP).map(([k, v]) => [v, k]))
const PATIENT_BELONG_REVERSE = Object.fromEntries(Object.entries(PATIENT_BELONG_MAP).map(([k, v]) => [v, k]))
const CASE_TYPE_REVERSE = Object.fromEntries(Object.entries(CASE_TYPE_MAP).map(([k, v]) => [v, k]))
const CASE_ATTRIBUTE_REVERSE = Object.fromEntries(Object.entries(CASE_ATTRIBUTE_MAP).map(([k, v]) => [v, k]))

// ============== 枚举转换函数 ==============

export function formatGenderForDisplay(gender: string): string {
  return GENDER_MAP[gender] || gender
}

export function formatAuditStatusForDisplay(auditStatus: string): string {
  return AUDIT_STATUS_MAP[auditStatus] || auditStatus
}

export function formatAssignStatusForDisplay(assignStatus: string): string {
  return ASSIGN_STATUS_MAP[assignStatus] || assignStatus
}

export function formatReportCategoryForDisplay(category: string): string {
  return REPORT_CATEGORY_MAP[category] || category
}

export function formatReportStatusForDisplay(status: string): string {
  return REPORT_STATUS_MAP[status] || status
}

export function formatAddressTypeForDisplay(type: string): string {
  return ADDRESS_TYPE_MAP[type] || type
}

export function formatPatientBelongForDisplay(belong: string): string {
  return PATIENT_BELONG_MAP[belong] || belong
}

export function formatCaseTypeForDisplay(type: string): string {
  return CASE_TYPE_MAP[type] || type
}

export function formatCaseAttributeForDisplay(attr: string): string {
  return CASE_ATTRIBUTE_MAP[attr] || attr
}

export function formatUploadStatusForDisplay(uploadStatus: string): string {
  return UPLOAD_STATUS_MAP[uploadStatus] || uploadStatus
}

export function parseGenderFromDisplay(display: string): string {
  return GENDER_REVERSE[display] || display
}

export function parseAuditStatusFromDisplay(display: string): string {
  return AUDIT_STATUS_REVERSE[display] || display
}

export function parseAssignStatusFromDisplay(display: string): string {
  return ASSIGN_STATUS_REVERSE[display] || display
}

export function parseUploadStatusFromDisplay(display: string): string {
  return UPLOAD_STATUS_REVERSE[display] || display
}

export function parseReportCategoryFromDisplay(display: string): string {
  return REPORT_CATEGORY_REVERSE[display] || display
}

export function parseReportStatusFromDisplay(display: string): string {
  return REPORT_STATUS_REVERSE[display] || display
}

export function parseAddressTypeFromDisplay(display: string): string {
  return ADDRESS_TYPE_REVERSE[display] || display
}

export function parsePatientBelongFromDisplay(display: string): string {
  return PATIENT_BELONG_REVERSE[display] || display
}

export function parseCaseTypeFromDisplay(display: string): string {
  return CASE_TYPE_REVERSE[display] || display
}

export function parseCaseAttributeFromDisplay(display: string): string {
  return CASE_ATTRIBUTE_REVERSE[display] || display
}

// ============== 数据转换函数 ==============

/** 将后端 ReportCardDTO 转换为前端表格显示格式 */
export function transformReportCardForDisplay(dto: ReportCardDTO) {
  return {
    ...dto,
    reportCategory: dto.reportCategory ? formatReportCategoryForDisplay(dto.reportCategory) : '-',
    reportStatus: dto.reportStatus ? formatReportStatusForDisplay(dto.reportStatus) : '-',
    auditStatus: formatAuditStatusForDisplay(dto.auditStatus),
    patientInfo: dto.patientInfo
      ? {
          ...dto.patientInfo,
          gender: dto.patientInfo.gender ? formatGenderForDisplay(dto.patientInfo.gender) : null,
          addressType: dto.patientInfo.addressType
            ? formatAddressTypeForDisplay(dto.patientInfo.addressType)
            : null
        }
      : null,
    diagnosisInfo: dto.diagnosisInfo
      ? {
          ...dto.diagnosisInfo,
          patientBelong: dto.diagnosisInfo.patientBelong
            ? formatPatientBelongForDisplay(dto.diagnosisInfo.patientBelong)
            : null,
          caseType: dto.diagnosisInfo.caseType
            ? formatCaseTypeForDisplay(dto.diagnosisInfo.caseType)
            : null,
          caseAttribute: dto.diagnosisInfo.caseAttribute
            ? formatCaseAttributeForDisplay(dto.diagnosisInfo.caseAttribute)
            : null
        }
      : null,
    auditInfo: dto.auditInfo
      ? {
          ...dto.auditInfo,
          auditStatus: formatAuditStatusForDisplay(dto.auditInfo.auditStatus),
          assignStatus: formatAssignStatusForDisplay(dto.auditInfo.assignStatus),
          auditDate: dto.auditInfo.auditDate ? dto.auditInfo.auditDate.split('T')[0] : null
        }
      : null
  }
}

/** 将 CDC 上报 DTO 转换为前端显示格式 */
export function transformCdcUploadForDisplay(dto: any) {
  return {
    ...dto,
    gender: formatGenderForDisplay(dto.gender),
    uploadStatus: formatUploadStatusForDisplay(dto.uploadStatus),
    uploadTime: dto.uploadTime ? dto.uploadTime.split('T')[0] : '-',
    uploadOperatorName: dto.uploadOperatorName || '-',
    auditorName: dto.auditorName || '-',
    auditDate: dto.auditDate ? dto.auditDate.split('T')[0] : '-'
  }
}

/** 将表单数据转换为创建请求格式 */
export function transformFormDataForCreate(formData: Record<string, any>) {
  return {
    hospitalArea: formData.hospitalArea,
    department: formData.department,
    inpatientNo: formData.inpatientNo || undefined,
    outpatientNo: formData.outpatientNo || undefined,
    doctorName: formData.doctorName,
    fillDate: formData.fillDate || formData.diagnosisDate,
    cardNumber: formData.cardNumber || undefined,
    reportCategory: parseReportCategoryFromDisplay(formData.reportCategory) || undefined,
    patientInfo: {
      patientName: formData.patientName,
      idCard: formData.idCard,
      birthday: formData.birthday || undefined,
      gender: parseGenderFromDisplay(formData.gender) || undefined,
      age: formData.age || undefined,
      phone: formData.phone,
      parentName: formData.parentName || undefined,
      workUnit: formData.workUnit || undefined,
      addressType: parseAddressTypeFromDisplay(formData.addressType) || undefined,
      detailAddress: formData.detailAddress
    },
    diagnosisInfo: {
      diseaseName: formData.diseaseName,
      diagnosisCode: formData.diagnosisCode || undefined,
      patientBelong: parsePatientBelongFromDisplay(formData.patientBelong) || undefined,
      crowdCategories: formData.crowdCategories?.length ? formData.crowdCategories : undefined,
      caseType: parseCaseTypeFromDisplay(formData.caseType) || undefined,
      caseAttribute: parseCaseAttributeFromDisplay(formData.caseAttribute) || undefined,
      onsetDate: formData.onsetDate || undefined,
      diagnosisDate: formData.diagnosisDate,
      deathDate: formData.deathDate || undefined,
      remark: formData.remark || undefined
    }
  }
}

/** 将表单数据转换为更新请求格式 */
export function transformFormDataForUpdate(formData: Record<string, any>) {
  const data: any = {}
  if (formData.cardNumber) data.cardNumber = formData.cardNumber
  if (formData.reportCategory) data.reportCategory = parseReportCategoryFromDisplay(formData.reportCategory)
  if (formData.reportStatus) data.reportStatus = parseReportStatusFromDisplay(formData.reportStatus)
  if (formData.doctorName) data.doctorName = formData.doctorName
  if (formData.phone || formData.addressType || formData.detailAddress) {
    data.patientInfo = {}
    if (formData.phone) data.patientInfo.phone = formData.phone
    if (formData.addressType) data.patientInfo.addressType = parseAddressTypeFromDisplay(formData.addressType)
    if (formData.detailAddress) data.patientInfo.detailAddress = formData.detailAddress
  }
  if (formData.diseaseName || formData.diagnosisDate) {
    data.diagnosisInfo = {}
    if (formData.diseaseName) data.diagnosisInfo.diseaseName = formData.diseaseName
    if (formData.diagnosisDate) data.diagnosisInfo.diagnosisDate = formData.diagnosisDate
  }
  return data
}

// ============== UI 辅助函数 ==============

/** 获取审核状态对应的 Element Plus Tag 类型 */
export function getAuditStatusTagType(auditStatus: string): string {
  const map: Record<string, string> = {
    待审核: 'warning',
    PENDING: 'warning',
    已审核: 'success',
    APPROVED: 'success',
    审核不通过: 'danger',
    REJECTED: 'danger'
  }
  return map[auditStatus] || 'info'
}

/** 获取分配状态对应的 Element Plus Tag 类型 */
export function getAssignStatusTagType(assignStatus: string): string {
  const map: Record<string, string> = {
    未分配: 'info',
    UNASSIGNED: 'info',
    已分配: 'primary',
    ASSIGNED: 'primary',
    处理中: 'primary',
    IN_PROGRESS: 'primary',
    已完成: 'success',
    COMPLETED: 'success',
    已作废: 'warning',
    VOID: 'warning'
  }
  return map[assignStatus] || 'info'
}

export function getUploadStatusTagType(uploadStatus: string): string {
  const map: Record<string, string> = {
    未上报: 'info',
    NOT_UPLOADED: 'info',
    上报中: 'warning',
    UPLOADING: 'warning',
    已上报: 'success',
    UPLOADED: 'success',
    上报失败: 'danger',
    UPLOAD_FAILED: 'danger'
  }
  return map[uploadStatus] || 'info'
}

/** @deprecated 使用 getAuditStatusTagType 替代 */
export function getStatusTagType(status: string): string {
  return getAuditStatusTagType(status)
}
