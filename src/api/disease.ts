/*
疾病分类管理 API
*/

import request from './request'
import type {
  DiseaseCategory,
  DiseaseCategoryCreateRequest,
  DiseaseCategoryUpdateRequest,
  DiseaseType,
  DiseaseTypeCreateRequest,
  DiseaseTypeUpdateRequest,
  PageQuery,
  DiseaseTypePageQuery,
  ApiResponse,
  PageResponse
} from '@/types/disease'

// ============== 疾病分类 API ==============

/** 疾病分类 API */
export const diseaseCategoryApi = {
  /** 创建疾病分类 */
  create(data: DiseaseCategoryCreateRequest): Promise<DiseaseCategory> {
    return request({
      url: '/disease-categories',
      method: 'post',
      data
    })
  },

  /** 获取分类详情 */
  getById(id: string): Promise<DiseaseCategory> {
    return request({
      url: `/disease-categories/${id}`,
      method: 'get'
    })
  },

  /** 根据编码获取分类 */
  getByCode(categoryCode: string): Promise<DiseaseCategory> {
    return request({
      url: `/disease-categories/code/${categoryCode}`,
      method: 'get'
    })
  },

  /** 更新分类 */
  update(id: string, data: DiseaseCategoryUpdateRequest): Promise<DiseaseCategory> {
    return request({
      url: `/disease-categories/${id}`,
      method: 'put',
      data
    })
  },

  /** 删除分类 */
  delete(id: string): Promise<{ message: string }> {
    return request({
      url: `/disease-categories/${id}`,
      method: 'delete'
    })
  },

  /** 分页查询分类 */
  getPage(params?: PageQuery): Promise<PageResponse<DiseaseCategory>> {
    return request({
      url: '/disease-categories',
      method: 'get',
      params
    })
  },

  /** 搜索分类 */
  search(keyword: string): Promise<DiseaseCategory[]> {
    return request({
      url: '/disease-categories/search',
      method: 'get',
      params: { keyword }
    })
  },

  /** 获取所有启用的分类 */
  getActive(): Promise<DiseaseCategory[]> {
    return request({
      url: '/disease-categories/active',
      method: 'get'
    })
  },

  /** 获取所有启用的分类(排序) */
  getActiveSorted(): Promise<DiseaseCategory[]> {
    return request({
      url: '/disease-categories/active/sorted',
      method: 'get'
    })
  },

  /** 启用分类 */
  activate(id: string): Promise<{ message: string }> {
    return request({
      url: `/disease-categories/${id}/activate`,
      method: 'put'
    })
  },

  /** 停用分类 */
  deactivate(id: string): Promise<{ message: string }> {
    return request({
      url: `/disease-categories/${id}/deactivate`,
      method: 'put'
    })
  },

  /** 检查分类编码是否存在 */
  checkCodeExists(categoryCode: string, excludeId?: string): Promise<boolean> {
    return request({
      url: '/disease-categories/check/code',
      method: 'get',
      params: { categoryCode, excludeId }
    })
  }
}

// ============== 疾病种类 API ==============

/** 疾病种类 API */
export const diseaseTypeApi = {
  /** 创建疾病种类 */
  create(data: DiseaseTypeCreateRequest): Promise<DiseaseType> {
    return request({
      url: '/disease-types',
      method: 'post',
      data
    })
  },

  /** 获取疾病详情 */
  getById(id: string): Promise<DiseaseType> {
    return request({
      url: `/disease-types/${id}`,
      method: 'get'
    })
  },

  /** 根据编码获取疾病 */
  getByCode(diseaseCode: string): Promise<DiseaseType> {
    return request({
      url: `/disease-types/code/${diseaseCode}`,
      method: 'get'
    })
  },

  /** 更新疾病 */
  update(id: string, data: DiseaseTypeUpdateRequest): Promise<DiseaseType> {
    return request({
      url: `/disease-types/${id}`,
      method: 'put',
      data
    })
  },

  /** 删除疾病 */
  delete(id: string): Promise<{ message: string }> {
    return request({
      url: `/disease-types/${id}`,
      method: 'delete'
    })
  },

  /** 分页查询疾病 */
  getPage(params?: DiseaseTypePageQuery): Promise<PageResponse<DiseaseType>> {
    return request({
      url: '/disease-types',
      method: 'get',
      params
    })
  },

  /** 搜索疾病 */
  search(keyword: string): Promise<DiseaseType[]> {
    return request({
      url: '/disease-types/search',
      method: 'get',
      params: { keyword }
    })
  },

  /** 获取所有启用的疾病 */
  getActive(): Promise<DiseaseType[]> {
    return request({
      url: '/disease-types/active',
      method: 'get'
    })
  },

  /** 根据分类ID获取疾病列表 */
  getByCategory(categoryId: string): Promise<DiseaseType[]> {
    return request({
      url: `/disease-types/category/${categoryId}`,
      method: 'get'
    })
  },

  /** 根据分类ID获取启用的疾病(排序) */
  getActiveByCategory(categoryId: string): Promise<DiseaseType[]> {
    return request({
      url: `/disease-types/category/${categoryId}/active/sorted`,
      method: 'get'
    })
  },

  /** 根据传染级别获取疾病列表 */
  getByInfectiousLevel(level: number): Promise<DiseaseType[]> {
    return request({
      url: `/disease-types/infectious/${level}`,
      method: 'get'
    })
  },

  /** 启用疾病 */
  activate(id: string): Promise<{ message: string }> {
    return request({
      url: `/disease-types/${id}/activate`,
      method: 'put'
    })
  },

  /** 停用疾病 */
  deactivate(id: string): Promise<{ message: string }> {
    return request({
      url: `/disease-types/${id}/deactivate`,
      method: 'put'
    })
  },

  /** 检查疾病编码是否存在 */
  checkCodeExists(diseaseCode: string, excludeId?: string): Promise<boolean> {
    return request({
      url: '/disease-types/check/code',
      method: 'get',
      params: { diseaseCode, excludeId }
    })
  }
}

// ============== 导出统一接口 ==============

export const diseaseApi = {
  ...diseaseCategoryApi,
  ...diseaseTypeApi
}

export default diseaseApi
