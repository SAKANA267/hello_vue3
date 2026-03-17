<!--
 * LoginHistory.vue
 * @description 登录历史查询页面，只读模式，支持状态筛选和时间范围查询
 * @author: Claude Code
 * @since: 2026-02-13
-->
<template>
  <div class="container">
    <CommonSearch
      v-model="queryParams"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <CommonTable
      ref="tableRef"
      :table-label="tableLabel"
      :get-api="fetchLoginHistory"
      :status-column="statusColumn"
      :status-tag-types="statusTagTypes"
      :permissions="{ canEdit: false, canDelete: false, canAudit: false, canRevoke: false }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, computed } from 'vue'
import { ElMessage } from 'element-plus'
import CommonSearch from '@/components/CommonSearch.vue'
import CommonTable from '@/components/CommonTable.vue'
import type { SearchField } from '@/components/CommonSearch.vue'
import { useAllDataStore } from '@/stores/index.js'

// 搜索字段配置（关键词和时间范围已内置到CommonSearch）
const searchFields: SearchField[] = [
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '全部', value: '' },
      { label: '成功', value: 'SUCCESS' },
      { label: '失败', value: 'FAILURE' }
    ]
  }
]

// 定义 CommonTable 组件实例类型
interface CommonTableInstance {
  search: (params?: Record<string, any>) => void
}

const { proxy } = getCurrentInstance() as any
const tableRef = ref<CommonTableInstance | null>(null)
const store = useAllDataStore()

// 获取当前用户ID（从store中获取）
const currentUserId = computed(() => {
  return store.state.user?.id || ''
})

// 表格列配置
const tableLabel = [
  { prop: 'username', label: '用户名', minWidth: '120' },
  { prop: 'loginTime', label: '登录时间', minWidth: '180' },
  { prop: 'loginLocation', label: '登录地点', minWidth: '120' },
  { prop: 'ipAddress', label: 'IP地址', minWidth: '140' },
  { prop: 'userAgent', label: '浏览器信息', minWidth: '200' },
  { prop: 'failReason', label: '失败原因', minWidth: '150' }
]

// 状态列配置
const statusColumn = { prop: 'status', label: '状态', width: '100' }

// 状态标签类型映射
const statusTagTypes = {
  SUCCESS: 'success',
  FAILURE: 'danger'
}

// 查询参数
const queryParams = reactive({
  keyWord: '',
  status: '',
  timeRange: null as [string, string] | null
})

// 获取登录历史数据（适配CommonTable的数据格式）
const fetchLoginHistory = async (params: {
  keyword?: string
  page?: number
  size?: number
  status?: string
  startTime?: string
  endTime?: string
}) => {
  try {
    const userId = currentUserId.value
    if (!userId) {
      ElMessage.warning('请先登录')
      return { total: 0, records: [] }
    }

    const requestParams: any = {
      userId,
      page: params.page || 1,
      size: params.size || 10
    }

    // 搜索参数通过 CommonTable.search() 传入
    if (params.keyword) {
      requestParams.keyword = params.keyword
    }
    if (params.status) {
      requestParams.status = params.status
    }
    if (params.startTime) {
      requestParams.startTime = params.startTime
    }
    if (params.endTime) {
      requestParams.endTime = params.endTime
    }

    const res = await proxy.$api.getLoginHistory(requestParams)

    return {
      total: res.total,
      records: res.records
    }
  } catch (error) {
    console.error('获取登录历史失败:', error)
    ElMessage.error('获取登录历史失败，请重试')
    return { total: 0, records: [] }
  }
}

// 查询按钮点击
const handleSearch = (searchData: Record<string, any>) => {
  const params: Record<string, any> = {}

  // 添加关键词筛选
  if (searchData.keyWord) {
    params.keyword = searchData.keyWord
  }

  // 添加状态筛选
  if (searchData.status) {
    params.status = searchData.status
  }

  // 添加时间范围筛选
  if (searchData.timeRange && searchData.timeRange.length === 2) {
    params.startTime = searchData.timeRange[0]
    params.endTime = searchData.timeRange[1]
  }

  console.log('handleSearch params:', params)
  tableRef.value?.search(params)
}

// 重置按钮点击
const handleReset = () => {
  // 清空查询参数并刷新
  queryParams.keyWord = ''
  queryParams.status = ''
  queryParams.timeRange = null
  tableRef.value?.search({})
}
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
