<!--
 * ObjectAudit.vue
 * @description 对象审核页面，使用 CommonTable 组件的审核功能
 * @author: SAKANA267
 * @since: 2025-01-22
-->
<template>
  <div class="container">
    <!-- 顶部操作栏 -->
    <div class="header-actions">
      <div class="title-section">
        <h2>对象审核</h2>
        <p class="subtitle">审核报卡信息与处理分配</p>
      </div>
    </div>

    <CommonSearch v-model="formInline" :fields="searchFields" @search="handleSearch" />

    <div class="object-table">
      <CommonTable
        ref="tableRef"
        :table-label="tableLabel"
        :get-api="getReportCardsWrapper"
        operation-mode="audit"
        :status-column="{ prop: 'auditStatus', label: '审核状态' }"
        :status-tag-types="statusTagTypes"
        :permissions="{
          canAudit: hasPermission('audit:approve'),
          canRevoke: hasPermission('audit:revoke')
        }"
        @audit="handleAuditClick"
        @revoke="handleRevoke"
      />
    </div>

    <!-- 审核对话框 -->
    <AuditDialog
      v-model="auditDialogVisible"
      :row-data="currentAuditRow"
      :table-label="tableLabel"
      :audit-detail-fields="auditDetailFields"
      @audit="performAudit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import CommonSearch from '@/components/CommonSearch.vue'
import CommonTable from '@/components/CommonTable.vue'
import AuditDialog from '@/components/AuditDialog.vue'
import { usePermissions } from '@/composables/usePermissions'
import { useAllDataStore } from '@/stores/index.js'
import { transformReportCardForDisplay } from '@/utils/reportCardUtils'
import type { SearchField } from '@/components/CommonSearch.vue'

// 定义 CommonTable 组件实例类型
interface CommonTableInstance {
  search: (params?: Record<string, any>) => void
}

const { hasPermission } = usePermissions()
const { proxy } = getCurrentInstance() as any
const store = useAllDataStore()
const tableRef = ref<CommonTableInstance | null>(null)

// 搜索字段配置（关键词已内置到CommonSearch）
const searchFields: SearchField[] = []

// 表格列配置
const tableLabel = [
  { prop: 'hospitalArea', label: '院区', minWidth: '100' },
  { prop: 'department', label: '科室', minWidth: '120' },
  { prop: 'diagnosisName', label: '诊断名称', minWidth: '150' },
  { prop: 'inpatientNo', label: '住院号', minWidth: '120' },
  { prop: 'outpatientNo', label: '门诊号', minWidth: '120' },
  { prop: 'name', label: '姓名', minWidth: '80' },
  { prop: 'gender', label: '性别', minWidth: '60' },
  { prop: 'age', label: '年龄', minWidth: '60' },
  { prop: 'phone', label: '联系电话', minWidth: '120' },
  { prop: 'reportDoctor', label: '报告医生', minWidth: '100' },
  { prop: 'fillDate', label: '填卡日期', minWidth: '120' }
]

// 状态标签类型映射
const statusTagTypes = {
  待审核: 'warning',
  已审核: 'success',
  审核不通过: 'danger'
}

// 审核对话框展示的字段列表
const auditDetailFields = ['name', 'department', 'diagnosisName', 'fillDate']

// 当前审核人ID（从 store 获取）
const currentAuditorId = computed(() => store.state.user?.id || '')

// 审核对话框状态
const auditDialogVisible = ref(false)
const currentAuditRow = ref(null)

// API 包装函数 - 适配新的 ReportCard API
const getReportCardsWrapper = async (config: any) => {
  const requestParams: any = {
    page: config.page || 1,
    size: 10
  }

  // 搜索参数（keyword, startTime, endTime）通过 CommonTable.search() 传入
  if (config.keyword) {
    requestParams.keyword = config.keyword
  }
  if (config.startTime) {
    requestParams.startTime = config.startTime
  }
  if (config.endTime) {
    requestParams.endTime = config.endTime
  }

  const response = await proxy.$api.getReportCards(requestParams)
  return {
    records: response.records.map(transformReportCardForDisplay),
    total: response.total
  }
}

// 搜索相关
const formInline = reactive({
  keyWord: '',
  timeRange: null as [string, string] | null
})

const handleSearch = (searchData: Record<string, any>) => {
  const params: Record<string, any> = {}

  // 添加关键词筛选
  if (searchData.keyWord) {
    params.keyword = searchData.keyWord
  }

  // 添加时间范围筛选
  if (searchData.timeRange && searchData.timeRange.length === 2) {
    params.startTime = searchData.timeRange[0]
    params.endTime = searchData.timeRange[1]
  }

  console.log('handleSearch params:', params)
  tableRef.value?.search(params)
}

// 处理审核按钮点击
const handleAuditClick = (row: any) => {
  console.log('handleAuditClick()审核对象:', row)
  currentAuditRow.value = row
  auditDialogVisible.value = true
}

// 执行审核操作
const performAudit = async ({ action, rowData, remark }: any) => {
  try {
    const auditData = {
      auditorId: currentAuditorId.value,
      ...(action === 'reject' && remark ? { remark } : {})
    }

    let res
    if (action === 'pass') {
      res = await proxy.$api.approveReportCard(rowData.id, auditData)
    } else {
      res = await proxy.$api.rejectReportCard(rowData.id, auditData)
    }
    ElMessage({
      showClose: true,
      message: action === 'pass' ? '审核通过' : '审核不通过',
      type: 'success'
    })
    auditDialogVisible.value = false
    await tableRef.value?.search()
  } catch (error) {
    console.error('审核操作失败:', error)
    ElMessage({
      showClose: true,
      message: (error as any).message || '审核操作失败，请重试',
      type: 'error'
    })
  }
}

// 处理撤回操作
const handleRevoke = async (row: any) => {
  try {
    const res = await proxy.$api.withdrawReportCard(row.id)
    ElMessage({
      showClose: true,
      message: '撤回成功',
      type: 'success'
    })
    await tableRef.value?.search()
  } catch (error) {
    console.error('撤回操作失败:', error)
    ElMessage({
      showClose: true,
      message: (error as any).message || '撤回操作失败，请重试',
      type: 'error'
    })
  }
}
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
}

@media (max-width: 768px) {
  .container {
    padding: 12px;

    .header-actions {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
  }
}
</style>
