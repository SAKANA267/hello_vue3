<template>
  <el-dialog
    :model-value="modelValue"
    :title="mode === 'create' ? '新建疾病种类' : '编辑疾病种类'"
    width="560px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="110px"
    >
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="疾病编码" prop="diseaseCode">
            <el-input
              v-model="formData.diseaseCode"
              placeholder="如: PLAGUE"
              :disabled="mode === 'edit'"
              maxlength="50"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="ICD-10编码" prop="icdCode">
            <el-input
              v-model="formData.icdCode"
              placeholder="如: A20"
              maxlength="20"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="疾病名称" prop="diseaseName">
        <el-input
          v-model="formData.diseaseName"
          placeholder="如: 鼠疫"
          maxlength="100"
        />
      </el-form-item>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="所属分类" prop="categoryId">
            <el-select
              v-model="formData.categoryId"
              placeholder="选择分类"
              style="width: 100%"
            >
              <el-option
                v-for="cat in categories"
                :key="cat.id"
                :label="cat.categoryName"
                :value="cat.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="传染级别" prop="infectiousLevel">
            <el-select
              v-model="formData.infectiousLevel"
              style="width: 100%"
            >
              <el-option label="甲类传染病" :value="1" />
              <el-option label="乙类传染病" :value="2" />
              <el-option label="丙类传染病" :value="3" />
              <el-option label="非传染病" :value="4" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="需要报卡" prop="reportRequired">
            <el-radio-group v-model="formData.reportRequired">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报卡时限" prop="reportDeadline">
            <el-input-number
              v-model="formData.reportDeadline"
              :min="1"
              :max="168"
              style="width: 100%"
            />
            <span class="unit-text">小时</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="排序序号" prop="sortOrder">
            <el-input-number v-model="formData.sortOrder" :min="0" :max="9999" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="疾病描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入疾病描述"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          :rows="2"
          placeholder="请输入备注"
          maxlength="500"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="$emit('update:modelValue', false)">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { diseaseApi } from '@/api/disease'
import type { DiseaseType, DiseaseTypeCreateRequest, DiseaseTypeUpdateRequest, DiseaseCategory } from '@/types/disease'
import { InfectiousLevel } from '@/types/disease'

const props = defineProps<{
  modelValue: boolean
  mode: 'create' | 'edit'
  data?: DiseaseType | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}>()

const formRef = ref<FormInstance>()
const submitting = ref(false)
const categories = ref<DiseaseCategory[]>([])

const formData = reactive({
  diseaseCode: '',
  diseaseName: '',
  categoryId: '',
  icdCode: '',
  description: '',
  infectiousLevel: InfectiousLevel.CLASS_B,
  reportRequired: 1,
  reportDeadline: 24,
  sortOrder: 0,
  status: 1,
  remark: ''
})

const rules: FormRules = {
  diseaseCode: [
    { required: true, message: '请输入疾病编码', trigger: 'blur' },
    {
      pattern: /^[A-Z0-9_]+$/,
      message: '只能包含大写字母、数字和下划线',
      trigger: 'blur'
    }
  ],
  diseaseName: [
    { required: true, message: '请输入疾病名称', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择所属分类', trigger: 'change' }
  ]
}

const loadCategories = async () => {
  const data = await diseaseApi.getActiveSorted()
  categories.value = data
}

watch(
  () => props.data,
  (newData) => {
    if (newData) {
      Object.assign(formData, {
        diseaseCode: newData.diseaseCode,
        diseaseName: newData.diseaseName,
        categoryId: newData.categoryId,
        icdCode: newData.icdCode || '',
        description: newData.description || '',
        infectiousLevel: newData.infectiousLevel,
        reportRequired: newData.reportRequired,
        reportDeadline: newData.reportDeadline || 24,
        sortOrder: newData.sortOrder,
        status: newData.status,
        remark: newData.remark || ''
      })
    } else {
      Object.assign(formData, {
        diseaseCode: '',
        diseaseName: '',
        categoryId: '',
        icdCode: '',
        description: '',
        infectiousLevel: InfectiousLevel.CLASS_B,
        reportRequired: 1,
        reportDeadline: 24,
        sortOrder: 0,
        status: 1,
        remark: ''
      })
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    if (props.mode === 'create') {
      const data: DiseaseTypeCreateRequest = {
        diseaseCode: formData.diseaseCode,
        diseaseName: formData.diseaseName,
        categoryId: formData.categoryId,
        icdCode: formData.icdCode || undefined,
        description: formData.description || undefined,
        infectiousLevel: formData.infectiousLevel,
        reportRequired: formData.reportRequired,
        reportDeadline: formData.reportDeadline,
        sortOrder: formData.sortOrder,
        status: formData.status,
        remark: formData.remark || undefined
      }
      await diseaseApi.create(data)
    } else {
      const data: DiseaseTypeUpdateRequest = {
        diseaseName: formData.diseaseName,
        categoryId: formData.categoryId,
        icdCode: formData.icdCode || undefined,
        description: formData.description || undefined,
        infectiousLevel: formData.infectiousLevel,
        reportRequired: formData.reportRequired,
        reportDeadline: formData.reportDeadline,
        sortOrder: formData.sortOrder,
        status: formData.status,
        remark: formData.remark || undefined
      }
      await diseaseApi.update(props.data!.id, data)
    }

    ElMessage.success(props.mode === 'create' ? '创建成功' : '更新成功')
    emit('success')
    emit('update:modelValue', false)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped lang="less">
.unit-text {
  margin-left: 8px;
  font-size: 13px;
  color: #94a3b8;
}
</style>
