/**
 * 传染病报告卡 API
 */
import request from './request'
import type {
  ApiResponse,
  TableDataResponse,
  PageParams
} from './types'
import type {
  InfectiousReportCardData,
  ReportCardMode
} from '@/components/DiseaseManagement/InfectiousReportCardDialog.vue'

/**
 * 传染病报告卡查询参数
 */
export interface ReportCardQueryParams extends PageParams {
  cardNumber?: string
  patientName?: string
  idCard?: string
  diseaseName?: string
  status?: string
  auditStatus?: 'PENDING' | 'APPROVED' | 'REJECTED'
  startDate?: string
  endDate?: string
}

/**
 * 传染病报告卡列表项
 */
export interface ReportCardListItem {
  id: string
  cardNumber: string
  patientName: string
  diseaseName: string
  status: string
  auditStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  fillDate: string
  createTime: string
}

/**
 * 创建报卡
 */
export async function createReportCard(data: InfectiousReportCardData) {
  return request.post<ApiResponse<{ id: string }>>('/api/report-card', data)
}

/**
 * 获取报卡列表
 */
export async function getReportCardList(params: ReportCardQueryParams) {
  return request.get<TableDataResponse<ReportCardListItem>>('/api/report-card', {
    params
  })
}

/**
 * 获取报卡详情
 */
export async function getReportCard(id: string) {
  return request.get<ApiResponse<InfectiousReportCardData>>(`/api/report-card/${id}`)
}

/**
 * 更新报卡
 */
export async function updateReportCard(
  id: string,
  data: Partial<InfectiousReportCardData>
) {
  return request.put<ApiResponse<void>>(`/api/report-card/${id}`, data)
}

/**
 * 删除报卡
 */
export async function deleteReportCard(id: string) {
  return request.delete<ApiResponse<void>>(`/api/report-card/${id}`)
}

/**
 * 提交审核
 */
export async function submitForAudit(id: string) {
  return request.post<ApiResponse<void>>(`/api/report-card/${id}/submit`)
}

/**
 * 审核通过
 */
export async function auditPass(id: string, remark?: string) {
  return request.post<ApiResponse<void>>(`/api/report-card/${id}/audit-pass`, {
    remark
  })
}

/**
 * 审核驳回
 */
export async function auditReject(id: string, rejectReason: string) {
  return request.post<ApiResponse<void>>(`/api/report-card/${id}/audit-reject`, {
    rejectReason
  })
}

/**
 * 撤销报卡
 */
export async function revokeReportCard(id: string) {
  return request.post<ApiResponse<void>>(`/api/report-card/${id}/revoke`)
}

/**
 * 上报国家疾控中心
 */
export async function uploadToCDC(id: string) {
  return request.post<ApiResponse<void>>(`/api/report-card/${id}/upload-cdc`)
}
