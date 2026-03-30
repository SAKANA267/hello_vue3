<template>
  <div class="create-form-dialog">
    <div class="dialog-header">
      <el-icon class="icon"><Plus /></el-icon>
      <span class="title">{{ createFormData.title }}</span>
    </div>
    <div v-if="createFormData.description" class="dialog-desc">
      {{ createFormData.description }}
    </div>
    <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
      <el-form-item
        v-for="field in createFormData.fields"
        :key="field.prop"
        :label="field.label"
        :prop="field.prop"
      >
        <el-input
          v-if="field.type === 'input'"
          v-model="form[field.prop]"
          :placeholder="field.placeholder || `请输入${field.label}`"
          :disabled="field.disabled"
        />
        <el-select
          v-else-if="field.type === 'select'"
          v-model="form[field.prop]"
          :placeholder="field.placeholder || `请选择${field.label}`"
          :disabled="field.disabled"
          style="width: 100%"
        >
          <el-option
            v-for="option in normalizedOptions(field.options)"
            :key="typeof option === 'object' ? option.value : option"
            :label="typeof option === 'object' ? option.label : option"
            :value="typeof option === 'object' ? option.value : option"
          />
        </el-select>
        <el-radio-group v-else-if="field.type === 'radio'" v-model="form[field.prop]">
          <el-radio
            v-for="option in normalizedOptions(field.options)"
            :key="typeof option === 'object' ? option.value : option"
            :label="typeof option === 'object' ? option.value : option"
          >
            {{ typeof option === 'object' ? option.label : option }}
          </el-radio>
        </el-radio-group>
        <el-date-picker
          v-else-if="field.type === 'date'"
          v-model="form[field.prop]"
          type="date"
          value-format="YYYY-MM-DD"
          :placeholder="field.placeholder || `请选择${field.label}`"
          :disabled="field.disabled"
          style="width: 100%"
        />
        <el-input
          v-else-if="field.type === 'textarea'"
          v-model="form[field.prop]"
          type="textarea"
          :rows="3"
          :placeholder="field.placeholder || `请输入${field.label}`"
          :disabled="field.disabled"
        />
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button size="small" @click="handleCancel">取消</el-button>
      <el-button size="small" type="primary" :loading="submitting" @click="handleSubmit">
        提交
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import request from '@/api/request'
import type { CreateFormData, FormFieldConfig } from '@/types/ai'

const props = defineProps<{
  createFormData: CreateFormData
}>()

const emit = defineEmits<{
  success: [data: any]
  cancel: []
  error: [message: string]
}>()

const formRef = ref()
const submitting = ref(false)

// Initialize form data
const form = reactive<Record<string, any>>({})

// Build validation rules
const rules = computed(() => {
  const rulesObj: Record<string, any> = {}
  props.createFormData.fields.forEach(field => {
    if (field.required) {
      rulesObj[field.prop] = [
        {
          required: true,
          message: `请输入${field.label}`,
          trigger: ['blur', 'change']
        }
      ]
    }
  })
  return rulesObj
})

// Normalize options to array of objects
function normalizedOptions(options?: Array<{ label: string; value: any }> | string[]) {
  if (!options) return []
  return options
}

// Initialize form with default values and initial data
onMounted(() => {
  props.createFormData.fields.forEach(field => {
    // Priority: initialData > defaultValue > empty
    if (props.createFormData.initialData?.[field.prop] !== undefined) {
      form[field.prop] = props.createFormData.initialData[field.prop]
    } else if (field.defaultValue !== undefined) {
      form[field.prop] = field.defaultValue
    } else {
      form[field.prop] = ''
    }
  })
})

async function handleSubmit() {
  try {
    // Validate form
    const valid = await formRef.value?.validate()
    if (!valid) return

    submitting.value = true

    // Submit to API
    const response = await request({
      url: props.createFormData.submitApi,
      method: props.createFormData.submitMethod || 'POST',
      data: form
    })

    ElMessage.success('创建成功')
    emit('success', response)
  } catch (error: any) {
    console.error('Create form submission error:', error)
    const message = error?.response?.data?.msg || error?.message || '创建失败，请稍后重试'
    ElMessage.error(message)
    emit('error', message)
  } finally {
    submitting.value = false
  }
}

function handleCancel() {
  emit('cancel')
}
</script>

<style scoped lang="less">
.create-form-dialog {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
  max-width: 400px;

  .dialog-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: #f0f9ff;
    border-bottom: 1px solid #d9ecff;

    .icon {
      font-size: 18px;
      color: #409eff;
    }

    .title {
      font-size: 14px;
      font-weight: 500;
      color: #303133;
    }
  }

  .dialog-desc {
    padding: 12px 16px;
    font-size: 13px;
    color: #606266;
    background: #fafafa;
    border-bottom: 1px solid #e5e5e5;
  }

  :deep(.el-form) {
    padding: 16px;

    .el-form-item {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .el-form-item__label {
      font-size: 13px;
      font-weight: 500;
      color: #606266;
      padding-bottom: 6px;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid #e5e5e5;
    background: #fafafa;
  }
}

// 移动端适配
@media (max-width: 768px) {
  .create-form-dialog {
    max-width: 100%;

    :deep(.el-form) {
      padding: 12px;

      .el-form-item {
        margin-bottom: 12px;
      }
    }
  }
}
</style>
