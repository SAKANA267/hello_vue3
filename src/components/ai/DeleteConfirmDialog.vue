<template>
  <div class="delete-confirm-dialog">
    <div class="dialog-header">
      <el-icon class="warning-icon"><Warning /></el-icon>
      <span class="dialog-title">确认删除</span>
    </div>
    <div class="dialog-body">
      <p class="confirm-text">确定要删除以下内容吗？此操作无法撤销。</p>
      <div class="object-info">
        <div class="info-item" v-for="(value, key) in displayInfo" :key="key">
          <span class="info-label">{{ formatLabel(key) }}:</span>
          <span class="info-value">{{ value }}</span>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <el-button size="small" @click="handleCancel">取消</el-button>
      <el-button size="small" type="danger" @click="handleConfirm">确认删除</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Warning } from '@element-plus/icons-vue'

const props = defineProps<{
  objectInfo: Record<string, any>
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const displayInfo = computed(() => {
  const info: Record<string, any> = {}
  for (const [key, value] of Object.entries(props.objectInfo)) {
    if (value !== null && value !== undefined && value !== '') {
      info[key] = value
    }
  }
  return info
})

function formatLabel(key: string): string {
  const labelMap: Record<string, string> = {
    id: 'ID',
    name: '名称',
    title: '标题',
    username: '用户名',
    email: '邮箱',
    type: '类型',
    status: '状态',
    createdAt: '创建时间',
    updatedAt: '更新时间',
    description: '描述'
  }
  return labelMap[key] || key
}

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
}
</script>

<style scoped lang="less">
.delete-confirm-dialog {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
  max-width: 320px;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fef0f0;
  border-bottom: 1px solid #fde2e2;
}

.warning-icon {
  font-size: 18px;
  color: #f56c6c;
}

.dialog-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.dialog-body {
  padding: 16px;
}

.confirm-text {
  margin: 0 0 12px;
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

.object-info {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 13px;

  &:not(:last-child) {
    border-bottom: 1px dashed #dcdfe6;
  }
}

.info-label {
  color: #909399;
  flex-shrink: 0;
}

.info-value {
  color: #303133;
  font-weight: 500;
  text-align: right;
  word-break: break-all;
  margin-left: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e5e5e5;
  background: #fafafa;
}
</style>
