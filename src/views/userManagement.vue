<!--
 * new page
 * @author: SAKANA267
 * @since: 2026-01-08
 * userManagement.vue
-->
<template>
  <div class="container">
    <CommonSearch v-model="formInline" :fields="searchFields" @search="handleSearch">
      <template #actions>
        <permission-button permission="user:manage" type="primary" @click="openDialog('add', null)">
          新增用户
        </permission-button>
      </template>
    </CommonSearch>

    <CommonTable
      ref="tableRef"
      :table-label="tableLabel"
      :get-api="getUsersWrapper"
      :delete-api="proxy?.$api.deleteUserRestful"
      :permissions="{
        canEdit: hasPermission('user:manage'),
        canDelete: hasPermission('user:manage')
      }"
      @edit="openDialog('edit', $event)"
    />

    <!--新增用户对话框-->
    <TableEditDialog
      ref="tableEditDialogRef"
      v-model="dialogVisible"
      :dialog-visible="dialogVisible"
      :form-fields="formFields"
      :rules="rules"
      :action="dialogAction"
      :row-data="currentRow"
      :add-api="proxy?.$api.createUserRestful"
      :edit-api="proxy?.$api.updateUserRestful"
      @refresh="refreshTable"
      @update:dialog-visible="dialogVisible = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance, reactive, computed } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import CommonSearch from '@/components/CommonSearch.vue'
import CommonTable from '@/components/CommonTable.vue'
import TableEditDialog from '@/components/TableEditDialog.vue'
import PermissionButton from '@/components/PermissionButton.vue'
import { usePermissions } from '@/composables/usePermissions'
import type { SearchField } from '@/components/CommonSearch.vue'
import type { RestfulPageParams, UserDTO } from '@/api/types'

// 定义 CommonTable 组件实例类型
interface CommonTableInstance {
  search: (params?: Record<string, any>) => void
}

const { hasPermission } = usePermissions()
const instance = getCurrentInstance()
const proxy = instance?.proxy
const tableRef = ref<CommonTableInstance | null>(null)
const tableEditDialogRef = ref<InstanceType<typeof TableEditDialog> | null>(null)

// 搜索字段配置（关键词和时间范围已内置到CommonSearch）
const searchFields: SearchField[] = []

// API 包装函数 - 获取用户列表
interface GetUsersConfig {
  page?: number
  size?: number
  keyword?: string
  startTime?: string
  endTime?: string
}

// 扩展分页参数以支持时间范围筛选
interface UserSearchParams extends RestfulPageParams {
  startTime?: string
  endTime?: string
}

const getUsersWrapper = async (config: GetUsersConfig) => {
  const requestParams: UserSearchParams = {
    page: config.page || 1,
    size: config.size || 10
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

  return await proxy?.$api.getUsers(requestParams)
}

//表格列配置 用于v-for创建表格列
const tableLabel = [
  { prop: 'username', label: '用户名', minWidth: '120' },
  { prop: 'name', label: '姓名', minWidth: '100' },
  { prop: 'email', label: '邮箱', minWidth: '180' },
  { prop: 'phone', label: '电话', minWidth: '130' },
  { prop: 'role', label: '角色', minWidth: '100' },
  { prop: 'status', label: '状态', minWidth: '100' },
  { prop: 'createTime', label: '创建时间', minWidth: '180' },
  { prop: 'lastLogin', label: '最后登录', minWidth: '150' }
]

// 密码字段（仅新增时使用）
const passwordField = {
  prop: 'password',
  label: '密码',
  type: 'input',
  inputType: 'password'
}

// 根据操作类型动态计算表单字段
const formFields = computed(() => {
  const fields = [
    {
      prop: 'username',
      label: '用户名',
      type: 'input',
      disabled: dialogAction.value === 'edit'
    },
    { prop: 'name', label: '姓名', type: 'input' },
    { prop: 'email', label: '邮箱', type: 'input' },
    { prop: 'phone', label: '电话', type: 'input' },
    { prop: 'role', label: '角色', type: 'select', options: ['ADMIN', 'USER', 'AUDITOR', 'GUEST'] },
    { prop: 'status', label: '状态', type: 'select', options: ['ACTIVE', 'INACTIVE'] }
  ]
  return dialogAction.value === 'add' ? [passwordField, ...fields] : fields
})

// 表单验证规则 用于el-form的rules属性
const baseRules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
})

const passwordRules = {
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ]
}

// 根据操作类型动态计算验证规则
const rules = computed(() => {
  return dialogAction.value === 'add' ? { ...passwordRules, ...baseRules } : baseRules
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
const currentRow = ref<UserDTO | null>(null)
const openDialog = (action: string, row: UserDTO | null = null) => {
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
