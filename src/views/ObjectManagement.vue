<!--
 * new page
 * @author: SAKANA267
 * @since: 2025-10-28
 * ObjectManagement.vue
-->
<template>
  <div class="container">
    <div class="header">
      <el-form :inline="true" :model="formInline">
        <el-form-item>
          <permission-button
            permission="object:create"
            type="primary"
            @click="openDialog('add', null)"
          >
            新增对象
          </permission-button>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="formInline.keyWord"
            placeholder="请输入查询内容"
            :prefix-icon="Search"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()"> 查询 </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="object-table">
      <CommonTable
        ref="tableRef"
        :table-label="tableLabel"
        :query-params="formInline.keyWord"
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
      @refresh="handleSearch()"
      @update:dialog-visible="dialogVisible = $event"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, reactive, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import TableEditDialog from '@/components/TableEditDialog.vue'
import PermissionButton from '@/components/PermissionButton.vue'
import { usePermissions } from '@/composables/usePermissions'
import {
  transformReportCardForDisplay,
  transformFormDataForCreate,
  transformFormDataForUpdate
} from '@/utils/reportCardUtils'

const { hasPermission } = usePermissions()

const { proxy } = getCurrentInstance()
const tableRef = ref(null)
const tableEditDialogRef = ref(null)

// 状态标签类型映射
const statusTagTypes = {
  待审核: 'warning',
  已审核: 'success',
  审核不通过: 'danger'
}

// API 包装函数 - 适配新的 ReportCard API
const getReportCardsWrapper = async config => {
  const response = await proxy.$api.getReportCards({
    keyword: config.keyword || config.keyWord,
    page: config.page || 1,
    size: 10
  })
  return {
    records: response.records.map(transformReportCardForDisplay),
    total: response.total
  }
}

const deleteReportCardWrapper = async data => {
  return await proxy.$api.deleteReportCard(data)
}

const createReportCardWrapper = async formData => {
  const transformedData = transformFormDataForCreate(formData)
  return await proxy.$api.createReportCard(transformedData)
}

const updateReportCardWrapper = async formData => {
  const transformedData = transformFormDataForUpdate(formData)
  return await proxy.$api.updateReportCard(formData.id, transformedData)
}

//表格列配置
const tableLabel = [
  { prop: 'hospitalArea', label: '院区', width: '100' },
  { prop: 'department', label: '科室', width: '120' },
  { prop: 'diagnosisName', label: '诊断名称', width: '150' },
  { prop: 'inpatientNo', label: '住院号', width: '120' },
  { prop: 'outpatientNo', label: '门诊号', width: '120' },
  { prop: 'name', label: '姓名', width: '80' },
  { prop: 'gender', label: '性别', width: '60' },
  { prop: 'age', label: '年龄', width: '60' },
  { prop: 'phone', label: '联系电话', width: '120' },
  { prop: 'reportDoctor', label: '报告医生', width: '100' },
  { prop: 'fillDate', label: '填卡日期', width: '110' },
  { prop: 'auditDate', label: '审核日期', width: '110' },
  { prop: 'auditor', label: '审核人', width: '80' },
  { prop: 'status', label: '状态', width: '100' }
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
  keyWord: ''
})
const handleSearch = () => {
  tableRef.value?.search()
}

//对话框表单相关
const dialogVisible = ref(false)
const dialogAction = ref('add')
const currentRow = ref(null)
const openDialog = (action, row = null) => {
  dialogAction.value = action
  currentRow.value = row
  dialogVisible.value = true
}

onMounted(() => {})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
