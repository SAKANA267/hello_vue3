<template>
  <el-dialog
    :model-value="modelValue"
    :title="mode === 'create' ? '新建疾病分类' : '编辑疾病分类'"
    width="500px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="分类编码" prop="categoryCode">
        <el-input
          v-model="formData.categoryCode"
          placeholder="如: RESP (大写字母、数字、下划线)"
          :disabled="mode === 'edit'"
          maxlength="50"
        />
      </el-form-item>

      <el-form-item label="分类名称" prop="categoryName">
        <el-input
          v-model="formData.categoryName"
          placeholder="如: 呼吸道传染病"
          maxlength="100"
        />
      </el-form-item>

      <el-form-item label="排序序号" prop="sortOrder">
        <el-input-number v-model="formData.sortOrder" :min="0" :max="9999" />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入分类描述"
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
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { diseaseCategoryApi } from '@/api/disease'
import type { DiseaseCategory, DiseaseCategoryCreateRequest, DiseaseCategoryUpdateRequest } from '@/types/disease'

const props = defineProps<{
  modelValue: boolean
  mode: 'create' | 'edit'
  data?: DiseaseCategory | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}>()

const formRef = ref<FormInstance>()
const submitting = ref(false)

const formData = reactive({
  categoryCode: '',
  categoryName: '',
  description: '',
  sortOrder: 0,
  status: 1,
  remark: ''
})

const rules: FormRules = {
  categoryCode: [
    { required: true, message: '请输入分类编码', trigger: 'blur' },
    {
      pattern: /^[A-Z0-9_]+$/,
      message: '只能包含大写字母、数字和下划线',
      trigger: 'blur'
    }
  ],
  categoryName: [
    { required: true, message: '请输入分类名称', trigger: 'blur' }
  ]
}

watch(
  () => props.data,
  (newData) => {
    if (newData) {
      Object.assign(formData, {
        categoryCode: newData.categoryCode,
        categoryName: newData.categoryName,
        description: newData.description || '',
        sortOrder: newData.sortOrder,
        status: newData.status,
        remark: newData.remark || ''
      })
    } else {
      Object.assign(formData, {
        categoryCode: '',
        categoryName: '',
        description: '',
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
      const data: DiseaseCategoryCreateRequest = {
        categoryCode: formData.categoryCode,
        categoryName: formData.categoryName,
        description: formData.description || undefined,
        sortOrder: formData.sortOrder,
        status: formData.status,
        remark: formData.remark || undefined
      }
      await diseaseCategoryApi.create(data)
    } else {
      const data: DiseaseCategoryUpdateRequest = {
        categoryName: formData.categoryName,
        description: formData.description || undefined,
        sortOrder: formData.sortOrder,
        status: formData.status,
        remark: formData.remark || undefined
      }
      await diseaseCategoryApi.update(props.data!.id, data)
    }

    ElMessage.success(props.mode === 'create' ? '创建成功' : '更新成功')
    emit('success')
    emit('update:modelValue', false)
  } finally {
    submitting.value = false
  }
}
</script>
