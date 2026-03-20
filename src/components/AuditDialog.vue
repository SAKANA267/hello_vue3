<!--
 * AuditDialog.vue
 * @description 审核对话框组件
 * @author: SAKANA267
 * @since: 2025-01-22
-->
<template>
  <el-dialog
    :model-value="modelValue"
    title="审核详情"
    :width="isMobile ? '95%' : '600px'"
    :fullscreen="isMobile"
    @update:model-value="$emit('update:modelValue', $event)"
    class="audit-dialog"
  >
    <div class="audit-content" v-if="rowData">
      <el-descriptions border :column="1">
        <el-descriptions-item
          v-for="field in auditDetailFields"
          :key="field"
          :label="getFieldLabel(field)"
        >
          {{ rowData[field] }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <el-form label-position="top" class="audit-form">
      <el-form-item label="审核备注">
        <el-input
          v-model="remark"
          type="textarea"
          :rows="isMobile ? 4 : 3"
          placeholder="请输入审核备注（选填）"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="audit-footer">
        <el-button @click="handleCancel"> 取消 </el-button>
        <el-button type="success" @click="handleAudit('pass')"> 通过 </el-button>
        <el-button type="danger" @click="handleAudit('reject')"> 不通过 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
/**
 * @component AuditDialog
 * @description 审核对话框组件
 * @props {Boolean} modelValue - 对话框显示状态（v-model）
 * @props {Object} rowData - 待审核的数据行
 * @props {Array} tableLabel - 表格列配置，用于获取字段标签
 * @props {Array} auditDetailFields - 审核对话框展示的字段列表
 * @emits update:modelValue - 更新对话框显示状态
 * @emits audit - 触发审核操作 { action: 'pass' | 'reject', rowData: Object, remark: String }
 */

import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  rowData: {
    type: Object,
    default: null
  },
  tableLabel: {
    type: Array,
    default: () => []
  },
  auditDetailFields: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'audit'])

// 响应式状态
const isMobile = ref(window.innerWidth <= 768)

// 处理窗口大小变化
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const remark = ref('')

// 监听对话框打开，清空备注
watch(
  () => props.modelValue,
  newVal => {
    if (newVal) {
      remark.value = ''
    }
  }
)

// 获取字段标签
const getFieldLabel = prop => {
  const field = props.tableLabel.find(item => item.prop === prop)
  return field ? field.label : prop
}

// 处理取消
const handleCancel = () => {
  emit('update:modelValue', false)
}

// 处理审核操作
const handleAudit = action => {
  emit('audit', {
    action,
    rowData: props.rowData,
    remark: remark.value
  })
}
</script>

<style scoped lang="less">
.audit-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
    max-height: 60vh;
    overflow-y: auto;
  }
}

.audit-content {
  margin-bottom: 16px;

  :deep(.el-descriptions) {
    .el-descriptions__label {
      font-weight: 500;
    }

    .el-descriptions__content {
      word-break: break-word;
    }
  }
}

.audit-form {
  margin-top: 20px;

  :deep(.el-form-item__label) {
    font-weight: 500;
  }
}

.audit-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

// 移动端全屏样式
@media (max-width: 768px) {
  .audit-dialog {
    &.is-fullscreen {
      :deep(.el-dialog__body) {
        max-height: calc(100vh - 150px);
        padding: 16px;
      }
    }
  }

  .audit-content {
    margin-bottom: 20px;

    :deep(.el-descriptions) {
      .el-descriptions__label {
        width: 100px;
        font-size: 14px;
      }

      .el-descriptions__content {
        font-size: 14px;
      }
    }
  }

  .audit-form {
    :deep(.el-textarea__inner) {
      min-height: 100px;
    }
  }

  .audit-footer {
    flex-direction: column;

    :deep(.el-button) {
      width: 100%;
      margin: 0;
    }
  }
}
</style>
