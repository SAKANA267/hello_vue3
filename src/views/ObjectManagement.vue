<!--
 * new page
 * @author: SAKANA267
 * @since: 2025-10-28
 * ObjectManagement.vue
-->
<template>
  <div class="container">
    <CommonSearch v-model="formInline" :fields="searchFields" @search="handleSearch">
      <template #actions>
        <permission-button
          permission="object:create"
          type="primary"
          @click="openDialog('add', null)"
        >
          新增对象
        </permission-button>
      </template>
    </CommonSearch>

    <div class="object-table">
      <CommonTable
        ref="tableRef"
        :table-label="tableLabel"
        :get-api="getReportCardsWrapper"
        :delete-api="deleteReportCardWrapper"
        :status-tag-types="statusTagTypes"
        :permissions="{
          canEdit: hasPermission('object:edit'),
          canDelete: hasPermission('object:delete')
        }"
        @edit="openDialog('edit', $event)"
      />
    </div>

    <!--新增用户对话框-->
    <TableEditDialog
      ref="tableEditDialogRef"
      v-model="dialogVisible"
      :dialog-visible="dialogVisible"
      :form-fields="formFields"
      :rules="rules"
      :action="dialogAction"
      :row-data="currentRow"
      :add-api="createReportCardWrapper"
      :edit-api="updateReportCardWrapper"
      @refresh="refreshTable"
      @update:dialog-visible="dialogVisible = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance, reactive } from 'vue'
import CommonSearch from '@/components/CommonSearch.vue'
import CommonTable from '@/components/CommonTable.vue'
import TableEditDialog from '@/components/TableEditDialog.vue'
import PermissionButton from '@/components/PermissionButton.vue'
import { usePermissions } from '@/composables/usePermissions'
import {
  transformReportCardForDisplay,
  transformFormDataForCreate,
  transformFormDataForUpdate
} from '@/utils/reportCardUtils'
import type { SearchField } from '@/components/CommonSearch.vue'

// 定义 CommonTable 组件实例类型
interface CommonTableInstance {
  search: (params?: Record<string, any>) => void
}

const { hasPermission } = usePermissions()

const { proxy } = getCurrentInstance() as any
const tableRef = ref<CommonTableInstance | null>(null)
const tableEditDialogRef = ref(null)

// 搜索字段配置（关键词已内置到CommonSearch）
const searchFields: SearchField[] = []

// 状态标签类型映射
const statusTagTypes = {
  待审核: 'warning',
  已审核: 'success',
  审核不通过: 'danger'
}

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

const deleteReportCardWrapper = async (data: any) => {
  return await proxy.$api.deleteReportCard(data)
}

const createReportCardWrapper = async (formData: any) => {
  const transformedData = transformFormDataForCreate(formData)
  return await proxy.$api.createReportCard(transformedData)
}

const updateReportCardWrapper = async (formData: any) => {
  const transformedData = transformFormDataForUpdate(formData)
  return await proxy.$api.updateReportCard(formData.id, transformedData)
}

//表格列配置
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
  { prop: 'fillDate', label: '填卡日期', minWidth: '110' },
  { prop: 'auditDate', label: '审核日期', minWidth: '110' },
  { prop: 'auditor', label: '审核人', minWidth: '80' },
  { prop: 'status', label: '状态', minWidth: '100' }
]

//编辑与创建用户 用于v-for创建编辑/新增表单
const formFields = [
  { prop: 'hospitalArea', label: '院区', type: 'input' },
  { prop: 'department', label: '科室', type: 'input' },
  { prop: 'diagnosisName', label: '诊断名称', type: 'input' },
  { prop: 'inpatientNo', label: '住院号', type: 'input' },
  { prop: 'outpatientNo', label: '门诊号', type: 'input' },
  { prop: 'name', label: '姓名', type: 'input' },
  {
    prop: 'gender',
    label: '性别',
    type: 'radio',
    options: [
      { label: '男', value: '男' },
      { label: '女', value: '女' }
    ]
  },
  { prop: 'age', label: '年龄', type: 'input' },
  { prop: 'phone', label: '联系电话', type: 'input' },
  { prop: 'reportDoctor', label: '报告医生', type: 'input' },
  { prop: 'fillDate', label: '填卡日期', type: 'date' }
  // 审核相关字段 (auditDate, auditor, status) 由审核流程管理，不在表单中编辑
]

// 表单验证规则 用于el-form的rules属性
const rules = reactive({
  hospitalArea: [{ required: true, message: '请输入院区', trigger: 'blur' }],
  department: [{ required: true, message: '请输入科室', trigger: 'blur' }],
  diagnosisName: [{ required: true, message: '请输入诊断名称', trigger: 'blur' }],
  inpatientNo: [{ required: true, message: '请输入住院号', trigger: 'blur' }],
  outpatientNo: [{ required: true, message: '请输入门诊号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  reportDoctor: [{ required: true, message: '请输入报告医生', trigger: 'blur' }],
  fillDate: [
    { required: true, message: '请选择填卡日期', trigger: 'blur' },
    { pattern: /^\d{4}-\d{2}-\d{2}$/, message: '日期格式必须为 yyyy-MM-dd', trigger: 'blur' }
  ]
  // 审核相关字段验证已移除，由审核流程管理
})

//搜索相关
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

// 刷新表格（保持当前搜索条件）
const refreshTable = () => {
  tableRef.value?.search()
}

//对话框表单相关
const dialogVisible = ref(false)
const dialogAction = ref('add')
const currentRow = ref(null)
const openDialog = (action: string, row: any = null) => {
  dialogAction.value = action
  currentRow.value = row
  dialogVisible.value = true
}

onMounted(() => {})
</script>

<style scoped lang="less">
.container {
  padding: 20px;
}

@media (max-width: 768px) {
  .container {
    padding: 12px;
  }
}
</style>
