<!--
 * LoginHistory.vue
 * @description 登录历史查询页面，只读模式，支持状态筛选和时间范围查询
 * @author: Claude Code
 * @since: 2026-02-13
-->
<template>
  <div class="container">
    <div class="header">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="状态">
          <el-select
            v-model="queryParams.status"
            placeholder="全部状态"
            clearable
            style="width: 120px"
          >
            <el-option label="全部" value="" />
            <el-option label="成功" value="SUCCESS" />
            <el-option label="失败" value="FAILURE" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="queryParams.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DDTHH:mm:ss"
            :default-time="defaultTime"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <CommonTable
      ref="tableRef"
      :table-label="tableLabel"
      :get-api="fetchLoginHistory"
      :status-column="statusColumn"
      :status-tag-types="statusTagTypes"
      operation-mode="none"
      :permissions="{ canEdit: false, canDelete: false }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, computed } from 'vue'
import { ElMessage } from 'element-plus'
import CommonTable from '@/components/CommonTable.vue'
import type { LoginHistoryDTO } from '@/api/types'
import { useAllDataStore } from '@/stores/index.js'

// 定义 CommonTable 组件实例类型
interface CommonTableInstance {
  search: () => void
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
  { prop: 'username', label: '用户名', width: '120' },
  { prop: 'loginTime', label: '登录时间', width: '180' },
  { prop: 'loginLocation', label: '登录地点', width: '120' },
  { prop: 'ipAddress', label: 'IP地址', width: '140' },
  { prop: 'userAgent', label: '浏览器信息', width: '200' },
  { prop: 'failReason', label: '失败原因', width: '150' }
]

// 状态列配置
const statusColumn = { prop: 'status', label: '状态', width: '100' }

// 状态标签类型映射
const statusTagTypes = {
  SUCCESS: 'success',
  FAILURE: 'danger'
}

// 默认时间范围选择器的默认时间
const defaultTime: [Date, Date] = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]

// 查询参数
const queryParams = reactive({
  status: '',
  timeRange: null as [string, string] | null
})

// 获取登录历史数据（适配CommonTable的数据格式）
const fetchLoginHistory = async (params: { keyword?: string; page?: number; size?: number }) => {
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

    // 添加状态筛选
    if (queryParams.status) {
      requestParams.status = queryParams.status
    }

    // 添加时间范围筛选
    if (queryParams.timeRange && queryParams.timeRange.length === 2) {
      requestParams.startTime = queryParams.timeRange[0]
      requestParams.endTime = queryParams.timeRange[1]
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
const handleSearch = () => {
  tableRef.value?.search()
}

// 重置按钮点击
const handleReset = () => {
  queryParams.status = ''
  queryParams.timeRange = null
  tableRef.value?.search()
}
</script>

<style scoped>
.container {
  padding: 20px;
}

.header {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>
