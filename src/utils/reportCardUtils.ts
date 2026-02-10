import type { ReportCardDTO } from '@/api/types'

// ============== 枚举映射常量 ==============

/** 后端性别枚举 → 前端显示 */
const GENDER_MAP: Record<string, string> = {
  MALE: '男',
  FEMALE: '女'
}

/** 后端状态枚举 → 前端显示 */
const STATUS_MAP: Record<string, string> = {
  PENDING: '待审核',
  APPROVED: '已审核',
  REJECTED: '审核不通过'
}

/** 前端显示 → 后端性别枚举 */
const GENDER_REVERSE: Record<string, string> = {
  男: 'MALE',
  女: 'FEMALE'
}

/** 前端显示 → 后端状态枚举 */
const STATUS_REVERSE: Record<string, string> = {
  待审核: 'PENDING',
  已审核: 'APPROVED',
  审核不通过: 'REJECTED'
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
 * 将后端状态枚举转换为前端显示文本
 * @param status - PENDING | APPROVED | REJECTED
 * @returns 待审核 | 已审核 | 审核不通过
 */
export function formatStatusForDisplay(status: string): string {
  return STATUS_MAP[status] || status
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
 * 将前端显示文本转换为后端状态枚举
 * @param display - 待审核 | 已审核 | 审核不通过
 * @returns PENDING | APPROVED | REJECTED
 */
export function parseStatusFromDisplay(display: string): string {
  return STATUS_REVERSE[display] || display
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
    status: formatStatusForDisplay(dto.status),
    auditDate: dto.auditDate ? dto.auditDate.split('T')[0] : '-',
    auditor: dto.auditor || '-'
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
 * 获取状态对应的 Element Plus Tag 类型
 * @param status - 前端或后端状态值
 * @returns warning | success | danger | info
 */
export function getStatusTagType(status: string): string {
  const map: Record<string, string> = {
    待审核: 'warning',
    PENDING: 'warning',
    已审核: 'success',
    APPROVED: 'success',
    审核不通过: 'danger',
    REJECTED: 'danger'
  }
  return map[status] || 'info'
}
