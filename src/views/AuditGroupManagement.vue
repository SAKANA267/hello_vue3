<!--
 * 审核组管理页面
 * @author: SAKANA267
 * @since: 2026-03-31
 * AuditGroupManagement.vue
-->
<template>
  <div class="container">
    <CommonSearch v-model="formInline" :fields="searchFields" @search="handleSearch">
      <template #actions>
        <permission-button permission="audit:group:manage" type="primary" @click="openDialog('add', null)">
          新增审核组
        </permission-button>
      </template>
    </CommonSearch>

    <CommonTable
      ref="tableRef"
      :table-label="tableLabel"
      :get-api="getAuditGroupsWrapper"
      :delete-api="proxy?.$api.deleteAuditGroup"
      :status-column="statusColumn"
      :status-tag-types="statusTagTypes"
      :permissions="{
        canEdit: hasPermission('audit:group:manage'),
        canDelete: hasPermission('audit:group:manage')
      }"
      @edit="openDialog('edit', $event)"
    >
      <template #operations="{ row }">
        <el-button
          v-if="hasPermission('audit:group:manage')"
          link
          type="primary"
          size="small"
          @click="openMemberDialog(row)"
        >
          成员管理
        </el-button>
        <el-button
          v-if="row.status === 'ACTIVE'"
          link
          type="warning"
          size="small"
          @click="handleStatusChange(row, 'deactivate')"
        >
          停用
        </el-button>
        <el-button
          v-else
          link
          type="success"
          size="small"
          @click="handleStatusChange(row, 'activate')"
        >
          启用
        </el-button>
      </template>
    </CommonTable>

    <!--新增/编辑审核组对话框-->
    <TableEditDialog
      ref="tableEditDialogRef"
      v-model="dialogVisible"
      :dialog-visible="dialogVisible"
      :form-fields="formFields"
      :rules="rules"
      :action="dialogAction"
      :row-data="currentRow"
      :add-api="proxy?.$api.createAuditGroup"
      :edit-api="(data: any) => proxy?.$api.updateAuditGroup(currentRow?.id || '', data)"
      @refresh="refreshTable"
      @update:dialog-visible="dialogVisible = $event"
    />

    <!--成员管理对话框-->
    <AuditGroupMemberDialog
      v-model:visible="memberDialogVisible"
      :group-id="currentGroup?.id || ''"
      :group-name="currentGroup?.groupName || ''"
      :leader-id="currentGroup?.leaderId"
      :leader-name="currentGroup?.leaderName"
      @refresh="refreshTable"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, computed, reactive } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import CommonSearch from '@/components/CommonSearch.vue'
import CommonTable from '@/components/CommonTable.vue'
import TableEditDialog from '@/components/TableEditDialog.vue'
import PermissionButton from '@/components/PermissionButton.vue'
import AuditGroupMemberDialog from '@/components/AuditGroupMemberDialog.vue'
import { usePermissions } from '@/composables/usePermissions'
import type { SearchField } from '@/components/CommonSearch.vue'
import type { AuditGroupDTO } from '@/api/types'
import { ElMessage, ElMessageBox } from 'element-plus'

// 定义 CommonTable 组件实例类型
interface CommonTableInstance {
  search: (params?: Record<string, any>) => void
}

const { hasPermission } = usePermissions()
const instance = getCurrentInstance()
const proxy = instance?.proxy
const tableRef = ref<CommonTableInstance | null>(null)
const tableEditDialogRef = ref<InstanceType<typeof TableEditDialog> | null>(null)

// 搜索字段配置
const searchFields: SearchField[] = [
  { prop: 'status', label: '状态', type: 'select', options: ['ACTIVE', 'INACTIVE'] }
]

// API 包装函数 - 获取审核组列表
interface GetAuditGroupsConfig {
  page?: number
  size?: number
  keyword?: string
  status?: string
}

const getAuditGroupsWrapper = async (config: GetAuditGroupsConfig) => {
  const requestParams: any = {
    page: config.page || 1,
    size: config.size || 10
  }

  if (config.keyword) {
    requestParams.keyword = config.keyword
  }
  if (config.status) {
    requestParams.status = config.status
  }

  return await proxy?.$api.getAuditGroups(requestParams)
}

// 表格列配置
const tableLabel = [
  { prop: 'groupName', label: '组名', minWidth: '150' },
  { prop: 'groupCode', label: '组编码', minWidth: '150' },
  { prop: 'description', label: '描述', minWidth: '200' },
  { prop: 'leaderName', label: '组长', minWidth: '100' },
  { prop: 'memberCount', label: '成员数', minWidth: '80' },
  { prop: 'status', label: '状态', minWidth: '100' },
  { prop: 'createTime', label: '创建时间', minWidth: '180' }
]

// 状态列配置
const statusColumn = {
  prop: 'status',
  label: '状态'
}

// 状态标签类型映射
const statusTagTypes = {
  ACTIVE: 'success',
  INACTIVE: 'info'
}

// 组编码字段（仅新增时使用）
const groupCodeField = {
  prop: 'groupCode',
  label: '组编码',
  type: 'input',
  placeholder: '请输入组编码（大写字母、数字、下划线）'
}

// 根据操作类型动态计算表单字段
const formFields = computed(() => {
  const fields = [
    { prop: 'groupName', label: '组名', type: 'input', placeholder: '请输入组名' },
    {
      prop: 'description',
      label: '描述',
      type: 'textarea',
      placeholder: '请输入描述'
    },
    { prop: 'status', label: '状态', type: 'select', options: ['ACTIVE', 'INACTIVE'] }
  ]
  return dialogAction.value === 'add' ? [groupCodeField, ...fields] : fields
})

// 组编码验证规则
const groupCodeRules = {
  groupCode: [
    { required: true, message: '请输入组编码', trigger: 'blur' },
    {
      pattern: /^[A-Z0-9_]+$/,
      message: '组编码只能包含大写字母、数字和下划线',
      trigger: 'blur'
    },
    { max: 20, message: '组编码最多20个字符', trigger: 'blur' }
  ]
}

// 表单验证规则
const baseRules = reactive({
  groupName: [
    { required: true, message: '请输入组名', trigger: 'blur' },
    { max: 50, message: '组名最多50个字符', trigger: 'blur' }
  ],
  description: [{ max: 200, message: '描述最多200个字符', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
})

// 根据操作类型动态计算验证规则
const rules = computed(() => {
  return dialogAction.value === 'add' ? { ...groupCodeRules, ...baseRules } : baseRules
})

// 搜索相关
const formInline = reactive({
  keyWord: '',
  status: ''
})

const handleSearch = (searchData: Record<string, any>) => {
  const params: Record<string, any> = {}

  if (searchData.keyWord) {
    params.keyword = searchData.keyWord
  }

  if (searchData.status) {
    params.status = searchData.status
  }

  console.log('handleSearch params:', params)
  tableRef.value?.search(params)
}

// 刷新表格
const refreshTable = async () => {
  tableRef.value?.search()
  // 如果成员管理对话框打开，更新 currentGroup 为最新数据
  if (memberDialogVisible.value && currentGroup.value) {
    try {
      const updatedGroup = await proxy?.$api.getAuditGroupById(currentGroup.value.id)
      currentGroup.value = updatedGroup
    } catch (error) {
      console.error('获取审核组信息失败:', error)
    }
  }
}

// 对话框表单相关
const dialogVisible = ref(false)
const dialogAction = ref('add')
const currentRow = ref<AuditGroupDTO | null>(null)

const openDialog = (action: string, row: AuditGroupDTO | null = null) => {
  dialogAction.value = action
  currentRow.value = row
  dialogVisible.value = true
}

// 成员管理对话框
const memberDialogVisible = ref(false)
const currentGroup = ref<AuditGroupDTO | null>(null)

const openMemberDialog = (row: AuditGroupDTO) => {
  currentGroup.value = row
  memberDialogVisible.value = true
}

// 状态切换
const handleStatusChange = async (row: AuditGroupDTO, action: 'activate' | 'deactivate') => {
  const actionText = action === 'activate' ? '启用' : '停用'
  try {
    await ElMessageBox.confirm(`确认${actionText}审核组"${row.groupName}"吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const apiFunc = action === 'activate' ? proxy?.$api.activateAuditGroup : proxy?.$api.deactivateAuditGroup
    await apiFunc?.(row.id)
    ElMessage.success(`${actionText}成功`)
    refreshTable()
  } catch {
    // 用户取消操作
  }
}
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
