<template>
  <div class="cascaded-selector">
    <el-select
      v-model="selectedCategoryId"
      placeholder="选择疾病分类"
      clearable
      @change="handleCategoryChange"
    >
      <el-option
        v-for="cat in categories"
        :key="cat.id"
        :label="cat.categoryName"
        :value="cat.id"
      />
    </el-select>

    <el-select
      v-model="selectedDiseaseId"
      placeholder="选择疾病"
      clearable
      :disabled="!selectedCategoryId"
      @change="handleDiseaseChange"
    >
      <el-option
        v-for="disease in diseases"
        :key="disease.id"
        :label="disease.diseaseName"
        :value="disease.id"
      >
        <span>{{ disease.diseaseName }}</span>
        <span class="disease-code">{{ disease.diseaseCode }}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { diseaseApi } from '@/api/disease'
import type { DiseaseCategory, DiseaseType } from '@/types/disease'

const emit = defineEmits<{
  (e: 'update:category', value: DiseaseCategory | null): void
  (e: 'update:disease', value: DiseaseType | null): void
}>()

const categories = ref<DiseaseCategory[]>([])
const diseases = ref<DiseaseType[]>([])
const selectedCategoryId = ref<string>()
const selectedDiseaseId = ref<string>()

const loadCategories = async () => {
  const data = await diseaseApi.getActiveSorted()
  categories.value = data
}

const handleCategoryChange = async (categoryId: string | undefined) => {
  selectedDiseaseId.value = undefined
  diseases.value = []

  if (categoryId) {
    const data = await diseaseApi.getActiveByCategory(categoryId)
    diseases.value = data
    const category = categories.value.find(c => c.id === categoryId)
    emit('update:category', category || null)
  } else {
    emit('update:category', null)
  }
  emit('update:disease', null)
}

const handleDiseaseChange = (diseaseId: string | undefined) => {
  const disease = diseases.value.find(d => d.id === diseaseId)
  emit('update:disease', disease || null)
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped lang="less">
.cascaded-selector {
  display: flex;
  gap: 12px;
}

.disease-code {
  margin-left: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #94a3b8;
}
</style>
