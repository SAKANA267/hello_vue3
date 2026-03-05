<template>
  <div class="request-data-card">
    <div class="card-header">
      <el-icon class="header-icon"><InfoFilled /></el-icon>
      <span class="card-title">{{ title }}</span>
      <span v-if="dataCount !== null" class="data-count">共 {{ dataCount }} 条</span>
    </div>
    <div class="card-body">
      <p v-if="description" class="description">{{ description }}</p>

      <!-- 表格展示 -->
      <div v-if="displayData.length > 0" class="table-wrapper">
        <el-table
          :data="paginatedData"
          size="small"
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontSize: '13px' }"
          :cell-style="{ fontSize: '13px' }"
          style="width: 100%"
        >
          <el-table-column
            v-for="col in columns"
            :key="col.key"
            :prop="col.key"
            :label="col.label"
            :width="col.width"
            show-overflow-tooltip
          />
        </el-table>

        <!-- 分页（当数据超过pageSize时显示） -->
        <div v-if="displayData.length > pageSize" class="pagination">
          <el-pagination
            size="small"
            layout="prev, pager, next"
            :total="displayData.length"
            :page-size="pageSize"
            @current-change="handlePageChange"
          />
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty v-else description="暂无数据" :image-size="60" />
    </div>
    <div v-if="showActions" class="card-footer">
      <el-button size="small" @click="handleCopy">复制</el-button>
      <el-button size="small" type="primary" @click="handleAction">
        {{ actionText }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { TableColumn } from '@/types/ai'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    data?: Record<string, any>[] | Record<string, any>
    columns?: TableColumn[]
    pageSize?: number
    showActions?: boolean
    actionText?: string
  }>(),
  {
    title: '查询结果',
    pageSize: 3,
    showActions: false,
    actionText: '确认'
  }
)

const emit = defineEmits<{
  action: []
  copy: [data: string]
}>()

const currentPage = ref(1)

// 获取数组格式的数据
const displayData = computed(() => {
  if (!props.data) return []

  // 如果是数组，直接返回
  if (Array.isArray(props.data)) {
    return props.data
  }

  // 如果是对象，尝试转换为数组
  if (typeof props.data === 'object') {
    // 检查是否有常见的数组属性
    for (const key of ['list', 'data', 'items', 'records', 'result']) {
      if (Array.isArray(props.data[key])) {
        return props.data[key]
      }
    }
    // 将对象转为单元素数组
    return [props.data]
  }

  return []
})

// 数据总数
const dataCount = computed(() => displayData.value.length)

// 自动推断列配置
const inferredColumns = computed(() => {
  if (displayData.value.length === 0) return []

  const firstItem = displayData.value[0]
  const keys = Object.keys(firstItem)

  return keys.map(key => ({
    key,
    label: formatLabel(key)
  }))
})

// 使用传入的列配置或自动推断
const columns = computed(() => {
  return props.columns && props.columns.length > 0 ? props.columns : inferredColumns.value
})

// 当前页数据
const paginatedData = computed(() => {
  if (displayData.value.length <= props.pageSize) {
    return displayData.value
  }

  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return displayData.value.slice(start, end)
})

function formatLabel(key: string): string {
  const labelMap: Record<string, string> = {
    id: 'ID',
    name: '名称',
    username: '用户名',
    email: '邮箱',
    phone: '电话',
    title: '标题',
    type: '类型',
    status: '状态',
    createdAt: '创建时间',
    updatedAt: '更新时间',
    description: '描述'
  }
  return labelMap[key] || key
}

function handlePageChange(page: number) {
  currentPage.value = page
}

function handleAction() {
  emit('action')
}

function handleCopy() {
  const text = displayData.value
    .map(item =>
      columns.value.map(col => `${col.label}: ${item[col.key]}`).join(' | ')
    )
    .join('\n')
  emit('copy', text)
  ElMessage.success('已复制到剪贴板')
}
</script>

<style scoped lang="less">
.request-data-card {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
  max-width: 500px;
  width: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f0f9ff;
  border-bottom: 1px solid #dceefc;
}

.header-icon {
  font-size: 18px;
  color: #409eff;
}

.card-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.data-count {
  margin-left: auto;
  font-size: 12px;
  color: #909399;
}

.card-body {
  padding: 16px;
}

.description {
  margin: 0 0 12px;
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

.table-wrapper {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;

  :deep(.el-table) {
    font-size: 13px;
  }

  :deep(.el-table th) {
    padding: 8px 0;
  }

  :deep(.el-table td) {
    padding: 8px 0;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e5e5e5;
  background: #fafafa;
}
</style>
