import { defineStore } from 'pinia'
import { ref } from 'vue'
import { diseaseApi } from '@/api/disease'
import type { DiseaseCategory, DiseaseType } from '@/types/disease'

export const useDiseaseStore = defineStore('disease', () => {
  // 状态
  const categories = ref<DiseaseCategory[]>([])
  const diseases = ref<DiseaseType[]>([])
  const selectedCategory = ref<DiseaseCategory | null>(null)
  const loading = ref(false)

  // ========== 分类相关方法 ==========

  /** 获取所有启用的分类(排序) */
  const fetchActiveCategories = async () => {
    loading.value = true
    try {
      const data = await diseaseApi.getActiveSorted()
      categories.value = data
    } finally {
      loading.value = false
    }
  }

  /** 选择分类 */
  const selectCategory = async (category: DiseaseCategory | null) => {
    selectedCategory.value = category
    if (category) {
      await fetchDiseasesByCategory(category.id)
    } else {
      diseases.value = []
    }
  }

  // ========== 疾病相关方法 ==========

  /** 根据分类ID获取疾病列表 */
  const fetchDiseasesByCategory = async (categoryId: string) => {
    loading.value = true
    try {
      const data = await diseaseApi.getActiveByCategory(categoryId)
      diseases.value = data
    } finally {
      loading.value = false
    }
  }

  /** 清空疾病列表 */
  const clearDiseases = () => {
    diseases.value = []
    selectedCategory.value = null
  }

  return {
    // 状态
    categories,
    diseases,
    selectedCategory,
    loading,
    // 方法
    fetchActiveCategories,
    fetchDiseasesByCategory,
    selectCategory,
    clearDiseases
  }
})
