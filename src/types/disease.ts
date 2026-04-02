/** 传染级别枚举 */
export enum InfectiousLevel {
  CLASS_A = 1,
  CLASS_B = 2,
  CLASS_C = 3,
  NON_INFECTIOUS = 4
}

/** 状态枚举 */
export enum Status {
  DISABLED = 0,
  ENABLED = 1
}

/** 传染级别配置 */
export const INFECTIOUS_LEVEL_CONFIG = {
  [InfectiousLevel.CLASS_A]: {
    label: '甲类',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    description: '强制管理，2小时内上报'
  },
  [InfectiousLevel.CLASS_B]: {
    label: '乙类',
    color: '#EA580C',
    bgColor: '#FFEDD5',
    description: '严格管理，12小时内上报'
  },
  [InfectiousLevel.CLASS_C]: {
    label: '丙类',
    color: '#16A34A',
    bgColor: '#DCFCE7',
    description: '监测管理，24小时内上报'
  },
  [InfectiousLevel.NON_INFECTIOUS]: {
    label: '非传染',
    color: '#64748B',
    bgColor: '#F1F5F9',
    description: '非传染病'
  }
} as const

/** 疾病分类实体 */
export interface DiseaseCategory {
  id: string
  categoryCode: string
  categoryName: string
  description?: string
  sortOrder: number
  status: Status
  statusText: string
  diseaseCount: number
  createTime: string
  updateTime: string
  remark?: string
}

/** 疾病种类实体 */
export interface DiseaseType {
  id: string
  diseaseCode: string
  diseaseName: string
  categoryId: string
  categoryName: string
  icdCode?: string
  description?: string
  infectiousLevel: InfectiousLevel
  infectiousLevelText: string
  reportRequired: number
  reportDeadline?: number
  sortOrder: number
  status: Status
  statusText: string
  createTime: string
  updateTime: string
  remark?: string
}

/** API请求/响应类型 */
export interface DiseaseCategoryCreateRequest {
  categoryCode: string
  categoryName: string
  description?: string
  sortOrder?: number
  status?: Status
  remark?: string
}

export interface DiseaseCategoryUpdateRequest {
  categoryName?: string
  description?: string
  sortOrder?: number
  status?: Status
  remark?: string
}

export interface DiseaseTypeCreateRequest {
  diseaseCode: string
  diseaseName: string
  categoryId: string
  icdCode?: string
  description?: string
  infectiousLevel?: InfectiousLevel
  reportRequired?: number
  reportDeadline?: number
  sortOrder?: number
  status?: Status
  remark?: string
}

export interface DiseaseTypeUpdateRequest {
  diseaseName?: string
  categoryId?: string
  icdCode?: string
  description?: string
  infectiousLevel?: InfectiousLevel
  reportRequired?: number
  reportDeadline?: number
  sortOrder?: number
  status?: Status
  remark?: string
}

export interface PageQuery {
  page?: number
  size?: number
  keyword?: string
  status?: Status
}

export interface DiseaseTypePageQuery extends PageQuery {
  categoryId?: string
  infectiousLevel?: InfectiousLevel
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp?: string
}

export interface PageResponse<T> {
  page: number
  size: number
  total: number
  records: T[]
}
