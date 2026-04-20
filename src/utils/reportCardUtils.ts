import type { ReportCardDTO } from '@/api/types'

// ============== 枚举映射常量 ==============

/** 后端性别枚举 → 前端显示 */
const GENDER_MAP: Record<string, string> = {
  MALE: '男',
  FEMALE: '女'
}

/** 后端审核状态枚举 → 前端显示 (原 status) */
const AUDIT_STATUS_MAP: Record<string, string> = {
  PENDING: '待审核',
  APPROVED: '已审核',
  REJECTED: '审核不通过'
}

/** 后端分配状态枚举 → 前端显示 (新增) */
const ASSIGN_STATUS_MAP: Record<string, string> = {
  UNASSIGNED: '未分配',
  ASSIGNED: '已分配',
  IN_PROGRESS: '处理中',
  COMPLETED: '已完成',
  VOID: '已作废'
}

/** 前端显示 → 后端性别枚举 */
const GENDER_REVERSE: Record<string, string> = {
  男: 'MALE',
  女: 'FEMALE'
}

/** 前端显示 → 后端审核状态枚举 (原 status) */
const AUDIT_STATUS_REVERSE: Record<string, string> = {
  待审核: 'PENDING',
  已审核: 'APPROVED',
  审核不通过: 'REJECTED'
}

/** 前端显示 → 后端分配状态枚举 (新增) */
const ASSIGN_STATUS_REVERSE: Record<string, string> = {
  未分配: 'UNASSIGNED',
  已分配: 'ASSIGNED',
  处理中: 'IN_PROGRESS',
  已完成: 'COMPLETED',
  已作废: 'VOID'
}

/** 后端上报状态枚举 → 前端显示 */
const UPLOAD_STATUS_MAP: Record<string, string> = {
  NOT_UPLOADED: '未上报',
  UPLOADING: '上报中',
  UPLOADED: '已上报',
  UPLOAD_FAILED: '上报失败'
}

/** 前端显示 → 后端上报状态枚举 */
const UPLOAD_STATUS_REVERSE: Record<string, string> = {
  未上报: 'NOT_UPLOADED',
  上报中: 'UPLOADING',
  已上报: 'UPLOADED',
  上报失败: 'UPLOAD_FAILED'
}

// ============== 枚举转换函数 ==============

/**
 * 将后端性别枚举转换为前端显示文本
 * @param gender - MALE | FEMALE
 * @returns 男 | 女
 */
export function formatGenderForDisplay(gender: string): string {
  return GENDER_MAP[gender] || gender
}

/**
 * 将后端审核状态枚举转换为前端显示文本
 * @param auditStatus - PENDING | APPROVED | REJECTED
 * @returns 待审核 | 已审核 | 审核不通过
 */
export function formatAuditStatusForDisplay(auditStatus: string): string {
  return AUDIT_STATUS_MAP[auditStatus] || auditStatus
}

/**
 * 将后端分配状态枚举转换为前端显示文本 (新增)
 * @param assignStatus - UNASSIGNED | ASSIGNED | IN_PROGRESS | COMPLETED | VOID
 * @returns 未分配 | 已分配 | 处理中 | 已完成 | 已作废
 */
export function formatAssignStatusForDisplay(assignStatus: string): string {
  return ASSIGN_STATUS_MAP[assignStatus] || assignStatus
}

/**
 * 将前端显示文本转换为后端性别枚举
 * @param display - 男 | 女
 * @returns MALE | FEMALE
 */
export function parseGenderFromDisplay(display: string): string {
  return GENDER_REVERSE[display] || display
}

/**
 * 将前端显示文本转换为后端审核状态枚举
 * @param display - 待审核 | 已审核 | 审核不通过
 * @returns PENDING | APPROVED | REJECTED
 */
export function parseAuditStatusFromDisplay(display: string): string {
  return AUDIT_STATUS_REVERSE[display] || display
}

/**
 * 将前端显示文本转换为后端分配状态枚举 (新增)
 * @param display - 未分配 | 已分配 | 处理中 | 已完成 | 已作废
 * @returns UNASSIGNED | ASSIGNED | IN_PROGRESS | COMPLETED | VOID
 */
export function parseAssignStatusFromDisplay(display: string): string {
  return ASSIGN_STATUS_REVERSE[display] || display
}

export function formatUploadStatusForDisplay(uploadStatus: string): string {
  return UPLOAD_STATUS_MAP[uploadStatus] || uploadStatus
}

export function parseUploadStatusFromDisplay(display: string): string {
  return UPLOAD_STATUS_REVERSE[display] || display
}

export function transformCdcUploadForDisplay(dto: any) {
  return {
    ...dto,
    gender: formatGenderForDisplay(dto.gender),
    uploadStatus: formatUploadStatusForDisplay(dto.uploadStatus),
    uploadTime: dto.uploadTime ? dto.uploadTime.split('T')[0] : '-',
    uploadOperator: dto.uploadOperator || '-',
    auditor: dto.auditor || '-',
    auditDate: dto.auditDate ? dto.auditDate.split('T')[0] : '-'
  }
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

// ============== 数据转换函数 ==============

/**
 * 将后端 DTO 转换为前端显示格式
 * 处理枚举转换和字段名映射
 */
export function transformReportCardForDisplay(dto: ReportCardDTO) {
  return {
    ...dto,
    gender: formatGenderForDisplay(dto.gender),
    auditStatus: formatAuditStatusForDisplay(dto.auditStatus), // 原 status 改为 auditStatus
    assignStatus: formatAssignStatusForDisplay(dto.assignStatus), // 新增分配状态转换
    auditDate: dto.auditDate ? dto.auditDate.split('T')[0] : '-',
    auditor: dto.auditor || '-',
    assigneeName: dto.assigneeName || '-' // 新增分配人显示
  }
}

/**
 * 将表单数据转换为创建请求格式
 * 处理性别枚举转换
 */
export function transformFormDataForCreate(formData: Record<string, any>) {
  const { gender, ...rest } = formData
  return {
    ...rest,
    gender: parseGenderFromDisplay(gender)
  }
}

/**
 * 将表单数据转换为更新请求格式
 * 仅包含允许更新的字段
 */
export function transformFormDataForUpdate(formData: Record<string, any>) {
  const updateData: any = {}
  if (formData.diagnosisName) updateData.diagnosisName = formData.diagnosisName
  if (formData.phone) updateData.phone = formData.phone
  if (formData.reportDoctor) updateData.reportDoctor = formData.reportDoctor
  return updateData
}

// ============== UI 辅助函数 ==============

/**
 * 获取审核状态对应的 Element Plus Tag 类型
 * @param auditStatus - 前端或后端审核状态值
 * @returns warning | success | danger | info
 */
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

/**
 * 获取分配状态对应的 Element Plus Tag 类型 (新增)
 * @param assignStatus - 前端或后端分配状态值
 * @returns info | primary | success | warning
 */
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

/**
 * @deprecated 使用 getAuditStatusTagType 替代
 * 获取状态对应的 Element Plus Tag 类型 (兼容旧代码)
 */
export function getStatusTagType(status: string): string {
  return getAuditStatusTagType(status)
}
