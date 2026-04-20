<!--
 * CdcUpload.vue
 * @description 传染病报卡上报国家疾控中心页面
 * @author: SAKANA267
 * @since: 2026-04-20
-->
<template>
  <div class="container">
    <div class="header-actions">
      <div class="title-section">
        <h2>上报国家疾控中心</h2>
        <p class="subtitle">将审核通过的传染病报卡上传至国家疾控中心</p>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="stat-card" v-for="stat in statCards" :key="stat.label">
        <div class="stat-value" :style="{ color: stat.color }">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>

    <CommonSearch
      v-model="formInline"
      :fields="searchFields"
      :show-time-range="true"
      @search="handleSearch"
    >
      <template #actions>
        <el-button
          type="primary"
          :disabled="selectedRows.length === 0"
          @click="handleBatchUpload"
        >
          批量上报 ({{ selectedRows.length }})
        </el-button>
      </template>
    </CommonSearch>

    <div class="object-table">
      <CommonTable
        ref="tableRef"
        :table-label="tableLabel"
        :get-api="getApprovedReportCardsWrapper"
        :status-column="{ prop: 'uploadStatus', label: '上报状态' }"
        :status-tag-types="uploadStatusTagTypes"
      >
        <template #operations="{ row }">
          <el-button
            :disabled="row.uploadStatus === '已上报' || row.uploadStatus === '上报中'"
            type="text"
            @click="handleUploadSingle(row)"
            size="small"
          >
            {{ row.uploadStatus === '上报失败' ? '重试' : '上报' }}
          </el-button>
          <el-button type="text" @click="handleViewDetail(row)" size="small">
            详情
          </el-button>
        </template>
      </CommonTable>
    </div>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailVisible" title="报卡详情" width="600px">
      <el-descriptions :column="2" border v-if="currentDetailRow">
        <el-descriptions-item label="院区">{{ currentDetailRow.hospitalArea }}</el-descriptions-item>
        <el-descriptions-item label="科室">{{ currentDetailRow.department }}</el-descriptions-item>
        <el-descriptions-item label="诊断名称" :span="2">{{ currentDetailRow.diagnosisName }}</el-descriptions-item>
        <el-descriptions-item label="住院号">{{ currentDetailRow.inpatientNo }}</el-descriptions-item>
        <el-descriptions-item label="门诊号">{{ currentDetailRow.outpatientNo }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ currentDetailRow.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ currentDetailRow.gender }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ currentDetailRow.age }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentDetailRow.phone }}</el-descriptions-item>
        <el-descriptions-item label="报告医生">{{ currentDetailRow.reportDoctor }}</el-descriptions-item>
        <el-descriptions-item label="填卡日期">{{ currentDetailRow.fillDate }}</el-descriptions-item>
        <el-descriptions-item label="审核人">{{ currentDetailRow.auditor }}</el-descriptions-item>
        <el-descriptions-item label="审核日期">{{ currentDetailRow.auditDate }}</el-descriptions-item>
        <el-descriptions-item label="上报状态">
          <el-tag :type="getUploadStatusTagType(currentDetailRow.uploadStatus)" size="small">
            {{ currentDetailRow.uploadStatus }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="上报时间">{{ currentDetailRow.uploadTime }}</el-descriptions-item>
        <el-descriptions-item label="上报操作人">{{ currentDetailRow.uploadOperator }}</el-descriptions-item>
        <el-descriptions-item label="失败原因" v-if="currentDetailRow.failReason" :span="2">
          <span style="color: #f56c6c">{{ currentDetailRow.failReason }}</span>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CommonSearch from '@/components/CommonSearch.vue'
import CommonTable from '@/components/CommonTable.vue'
import { useAllDataStore } from '@/stores/index.js'
import { transformCdcUploadForDisplay, getUploadStatusTagType } from '@/utils/reportCardUtils'
import type { SearchField } from '@/components/CommonSearch.vue'

interface CommonTableInstance {
  search: (params?: Record<string, any>) => void
}

const { proxy } = getCurrentInstance() as any
const store = useAllDataStore()
const tableRef = ref<CommonTableInstance | null>(null)

const searchFields: SearchField[] = [
  {
    prop: 'department',
    label: '科室',
    type: 'select',
    options: ['全部', '内科', '外科', '儿科', '感染科', '呼吸科', '急诊科']
  }
]

const tableLabel = [
  { prop: 'hospitalArea', label: '院区', minWidth: '90' },
  { prop: 'department', label: '科室', minWidth: '100' },
  { prop: 'diagnosisName', label: '诊断名称', minWidth: '150' },
  { prop: 'name', label: '姓名', minWidth: '80' },
  { prop: 'gender', label: '性别', minWidth: '60' },
  { prop: 'age', label: '年龄', minWidth: '60' },
  { prop: 'reportDoctor', label: '报告医生', minWidth: '100' },
  { prop: 'fillDate', label: '填卡日期', minWidth: '110' },
  { prop: 'auditor', label: '审核人', minWidth: '80' },
  { prop: 'uploadTime', label: '上报时间', minWidth: '110' },
  { prop: 'uploadOperator', label: '上报人', minWidth: '80' }
]

const uploadStatusTagTypes = {
  未上报: 'info',
  上报中: 'warning',
  已上报: 'success',
  上报失败: 'danger'
}

// 当前用户ID
const currentUserId = computed(() => store.state.user?.id || '')

// 选中的行（批量上报用）
const selectedRows = ref<any[]>([])

// 统计数据
const uploadStats = reactive({
  total: 0,
  notUploaded: 0,
  uploaded: 0,
  uploadFailed: 0
})

const statCards = computed(() => [
  { label: '待上报总数', value: uploadStats.notUploaded, color: '#909399' },
  { label: '已上报', value: uploadStats.uploaded, color: '#67c23a' },
  { label: '上报失败', value: uploadStats.uploadFailed, color: '#f56c6c' },
  { label: '总记录数', value: uploadStats.total, color: '#409eff' }
])

// 详情对话框
const detailVisible = ref(false)
const currentDetailRow = ref<any>(null)

// API 包装函数
const getApprovedReportCardsWrapper = async (config: any) => {
  const requestParams: any = {
    page: config.page || 1,
    size: config.size || 10
  }

  if (config.keyword) requestParams.keyword = config.keyword
  if (config.department && config.department !== '全部') requestParams.department = config.department
  if (config.fillDateStart) requestParams.fillDateStart = config.fillDateStart
  if (config.fillDateEnd) requestParams.fillDateEnd = config.fillDateEnd

  const response = await proxy.$api.getCdcApprovedReportCards(requestParams)
  return {
    records: response.records.map(transformCdcUploadForDisplay),
    total: response.total
  }
}

// 搜索
const formInline = reactive({
  keyWord: '',
  timeRange: null as [string, string] | null,
  department: ''
})

const handleSearch = (searchData: Record<string, any>) => {
  const params: Record<string, any> = {}

  if (searchData.keyWord) params.keyword = searchData.keyWord
  if (searchData.department && searchData.department !== '全部') {
    params.department = searchData.department
  }
  if (searchData.timeRange && searchData.timeRange.length === 2) {
    params.fillDateStart = searchData.timeRange[0]
    params.fillDateEnd = searchData.timeRange[1]
  }

  tableRef.value?.search(params)
}

// 上报单个报告卡
const handleUploadSingle = async (row: any) => {
  const actionText = row.uploadStatus === '上报失败' ? '重试上报' : '上报'
  try {
    await ElMessageBox.confirm(
      `确认将 ${row.name} 的 ${row.diagnosisName} 报卡${actionText}至国家疾控中心？`,
      '确认上报',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )

    const apiCall =
      row.uploadStatus === '上报失败'
        ? proxy.$api.retryCdcUpload(row.reportCardId, currentUserId.value)
        : proxy.$api.uploadSingleToCdc(row.reportCardId, currentUserId.value)

    await apiCall
    ElMessage.success(`${actionText}请求已提交`)
    await refreshData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error?.message || `${actionText}失败，请重试`)
    }
  }
}

// 批量上报
const handleBatchUpload = async () => {
  try {
    await ElMessageBox.confirm(
      `确认批量上报 ${selectedRows.value.length} 张报卡至国家疾控中心？`,
      '批量上报确认',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )

    const result = await proxy.$api.batchUploadToCdc({
      reportCardIds: selectedRows.value.map((r: any) => r.reportCardId || r.id),
      operatorId: currentUserId.value
    })

    ElMessage.success(`上报完成：成功 ${result.successCount} 张，失败 ${result.failCount} 张`)
    selectedRows.value = []
    await refreshData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error?.message || '批量上报失败，请重试')
    }
  }
}

// 查看详情
const handleViewDetail = (row: any) => {
  currentDetailRow.value = row
  detailVisible.value = true
}

// 刷新数据（表格 + 统计）
const refreshData = async () => {
  tableRef.value?.search()
  await loadStatistics()
}

// 加载统计数据
const loadStatistics = async () => {
  try {
    const stats = await proxy.$api.getCdcUploadStatistics()
    Object.assign(uploadStats, stats)
  } catch (error) {
    console.error('获取上报统计失败:', error)
  }
}

onMounted(() => {
  loadStatistics()
})
</script>

<style scoped lang="less">
.container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100%;

  .header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .title-section {
      h2 {
        margin: 0 0 4px 0;
        font-size: 20px;
        color: #303133;
      }

      .subtitle {
        margin: 0;
        font-size: 14px;
        color: #909399;
      }
    }
  }

  .stats-row {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;

    .stat-card {
      flex: 1;
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);

      .stat-value {
        font-size: 28px;
        font-weight: 700;
        line-height: 1.2;
      }

      .stat-label {
        font-size: 13px;
        color: #909399;
        margin-top: 6px;
      }
    }
  }
}

@media (max-width: 768px) {
  .container {
    padding: 12px;

    .header-actions {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .stats-row {
      flex-wrap: wrap;

      .stat-card {
        flex: 1 1 calc(50% - 8px);
        min-width: calc(50% - 8px);
        padding: 14px;

        .stat-value {
          font-size: 22px;
        }
      }
    }
  }
}
</style>
