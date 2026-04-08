<!--
 * Assignment Rule Management Page
 * 分配规则管理页面
 * @author: SAKANA267
 * @since: 2026-04-07
-->
<template>
  <div class="rule-management-container">
    <!-- 顶部操作栏 -->
    <div class="header-actions">
      <div class="title-section">
        <h2>分配规则管理</h2>
        <p class="subtitle">配置自动分配规则，智能分配报卡给审核组</p>
      </div>
      <el-button type="primary" :icon="Plus" @click="openDialog('add')">新建规则</el-button>
    </div>

    <!-- 规则列表 -->
    <el-card class="main-card" shadow="never">
      <div class="table-header">
        <div class="filter-group">
          <el-select
            v-model="filter.status"
            placeholder="规则状态"
            clearable
            @change="handleSearch"
            style="width: 120px"
          >
            <el-option label="启用" value="ACTIVE" />
            <el-option label="停用" value="INACTIVE" />
          </el-select>
          <el-input
            v-model="filter.keyword"
            placeholder="搜索规则名称或编码"
            :prefix-icon="Search"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
            style="width: 250px"
          />
        </div>
        <el-button :icon="Refresh" @click="loadData">刷新</el-button>
      </div>

      <el-table :data="rules" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="ruleOrder" label="优先级" width="70" align="center">
          <template #default="scope">
            <el-tag size="small" type="info">{{ scope.row.ruleOrder }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ruleName" label="规则名称" min-width="180" />
        <el-table-column prop="ruleCode" label="规则编码" width="140" />
        <el-table-column label="匹配条件" min-width="200">
          <template #default="scope">
            <div class="match-conditions">
              <el-tag v-if="scope.row.diseaseCategory" size="small" type="primary">
                {{ scope.row.diseaseCategory }}
              </el-tag>
              <el-tag v-if="scope.row.hospitalArea" size="small" type="success">
                {{ scope.row.hospitalArea }}
              </el-tag>
              <el-tag v-if="scope.row.department" size="small" type="warning">
                {{ scope.row.department }}
              </el-tag>
              <span v-if="!scope.row.diseaseCategory && !scope.row.hospitalArea && !scope.row.department" class="text-muted">
                全部
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="assignStrategyDescription" label="分配策略" width="120" />
        <el-table-column prop="targetGroupName" label="目标审核组" width="110">
          <template #default="scope">
            {{ scope.row.targetGroupName || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="优先级" width="80">
          <template #default="scope">
            <el-tag :type="getPriorityTagType(scope.row.priority)" size="small">
              {{ scope.row.priorityDescription }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deadlineHours" label="截止时长" width="90" align="center">
          <template #default="scope">
            {{ scope.row.deadlineHours ? `${scope.row.deadlineHours}h` : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="ACTIVE"
              inactive-value="INACTIVE"
              @change="handleToggleStatus(scope.row)"
              :loading="scope.row._toggling"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" link @click="openDialog('edit', scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" link @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :total="pagination.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        class="pagination"
      />
    </el-card>

    <!-- 规则编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :width="isMobile ? '95%' : '600px'"
      :fullscreen="isMobile"
      @close="handleDialogClose"
      class="rule-dialog"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="规则名称" prop="ruleName">
              <el-input v-model="form.ruleName" placeholder="请输入规则名称" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规则编码" prop="ruleCode">
              <el-input
                v-model="form.ruleCode"
                placeholder="请输入规则编码（英文）"
                maxlength="30"
                :disabled="dialogAction === 'edit'"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="病种分类" prop="diseaseCategory">
              <el-select
                v-model="form.diseaseCategory"
                placeholder="请选择"
                clearable
                filterable
                allow-create
                style="width: 100%"
              >
                <el-option
                  v-for="item in diseaseCategories"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="院区" prop="hospitalArea">
              <el-select
                v-model="form.hospitalArea"
                placeholder="请选择"
                clearable
                filterable
                allow-create
                style="width: 100%"
              >
                <el-option
                  v-for="item in hospitalAreas"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="科室" prop="department">
              <el-select
                v-model="form.department"
                placeholder="请选择"
                clearable
                filterable
                allow-create
                style="width: 100%"
              >
                <el-option
                  v-for="item in departments"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分配策略" prop="assignStrategy">
              <el-select v-model="form.assignStrategy" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in assignStrategyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <div class="strategy-option">
                    <span>{{ item.label }}</span>
                    <span class="strategy-desc">{{ item.desc }}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.assignStrategy === 'MANUAL'">
            <el-form-item label="指定审核组" prop="targetGroupId">
              <el-select
                v-model="form.targetGroupId"
                placeholder="请选择"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="group in auditGroups"
                  :key="group.id"
                  :label="group.groupName"
                  :value="group.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认优先级" prop="priority">
              <el-select v-model="form.priority" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in priorityOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <el-tag :type="getPriorityTagType(item.value)" size="small">
                    {{ item.label }}
                  </el-tag>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="截止时长（小时）" prop="deadlineHours">
              <el-input-number
                v-model="form.deadlineHours"
                :min="1"
                :max="168"
                :step="1"
                placeholder="请输入"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规则优先级" prop="ruleOrder">
              <el-input-number
                v-model="form.ruleOrder"
                :min="0"
                :max="99"
                :step="1"
                placeholder="数字越小优先级越高"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="规则状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="ACTIVE">启用</el-radio>
            <el-radio label="INACTIVE">停用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-alert
          title="规则说明"
          type="info"
          :closable="false"
          show-icon
          class="rule-tips"
        >
          <ul>
            <li>规则按【优先级】顺序匹配，数字越小优先级越高</li>
            <li>匹配条件可组合，满足所有条件的报卡将按该规则分配</li>
            <li>【轮询分配】：按顺序依次分配给各审核组</li>
            <li>【最少任务优先】：分配给当前任务最少的审核组</li>
            <li>【手动指定】：必须指定目标审核组</li>
            <li>【组长分配】：由审核组组长手动分配</li>
          </ul>
        </el-alert>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ dialogAction === 'add' ? '创建' : '更新' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import { getCurrentInstance } from 'vue'
import type { AssignmentRuleDTO, AssignmentPriorityEnum } from '@/api/types'

const { proxy } = getCurrentInstance() as any

// 加载状态
const loading = ref(false)
const submitting = ref(false)

// 规则列表数据
const rules = ref<AssignmentRuleDTO[]>([])

// 分页数据
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 筛选条件
const filter = reactive({
  status: '',
  keyword: ''
})

// 对话框状态
const dialogVisible = ref(false)
const dialogAction = ref<'add' | 'edit'>('add')
const dialogTitle = computed(() => (dialogAction.value === 'add' ? '新建规则' : '编辑规则'))

// 表单数据
const form = reactive({
  ruleName: '',
  ruleCode: '',
  diseaseCategory: '',
  hospitalArea: '',
  department: '',
  assignStrategy: 'LEAST_TASKS' as any,
  targetGroupId: '',
  priority: 'NORMAL' as AssignmentPriorityEnum,
  deadlineHours: 24,
  status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  ruleOrder: 1
})

// 表单引用
const formRef = ref<FormInstance>()

// 审核组列表
const auditGroups = ref<any[]>([])

// 病种分类选项
const diseaseCategories = [
  '呼吸道传染病',
  '肠道传染病',
  '接触传染病',
  '虫媒传染病',
  '血液传染病'
]

// 院区选项
const hospitalAreas = ['总院', '东院', '南院', '北院']

// 科室选项
const departments = ['感染科', '呼吸内科', '儿科', '急诊科', '发热门诊']

// 分配策略选项
const assignStrategyOptions = [
  { label: '轮询分配', value: 'ROUND_ROBIN', desc: '依次分配' },
  { label: '最少任务优先', value: 'LEAST_TASKS', desc: '推荐' },
  { label: '手动指定', value: 'MANUAL', desc: '需指定审核组' },
  { label: '组长分配', value: 'LEADER', desc: '由组长分配' }
]

// 优先级选项
const priorityOptions = [
  { label: '低', value: 'LOW' },
  { label: '普通', value: 'NORMAL' },
  { label: '高', value: 'HIGH' },
  { label: '紧急', value: 'URGENT' }
]

// 表单验证规则
const rules_validation: FormRules = {
  ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  ruleCode: [
    { required: true, message: '请输入规则编码', trigger: 'blur' },
    { pattern: /^[A-Z0-9_]+$/, message: '规则编码只能包含大写字母、数字和下划线', trigger: 'blur' }
  ],
  assignStrategy: [{ required: true, message: '请选择分配策略', trigger: 'change' }],
  targetGroupId: [
    {
      required: true,
      message: '手动指定策略必须选择审核组',
      trigger: 'change',
      validator: (rule, value, callback) => {
        if (form.assignStrategy === 'MANUAL' && !value) {
          callback(new Error('请选择目标审核组'))
        } else {
          callback()
        }
      }
    }
  ],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
  deadlineHours: [{ required: true, message: '请输入截止时长', trigger: 'blur' }],
  ruleOrder: [{ required: true, message: '请输入规则优先级', trigger: 'blur' }]
}

// 获取优先级标签类型
const getPriorityTagType = (priority: AssignmentPriorityEnum) => {
  const map: Record<AssignmentPriorityEnum, string> = {
    LOW: 'info',
    NORMAL: '',
    HIGH: 'warning',
    URGENT: 'danger'
  }
  return map[priority] || ''
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 调用真实API获取规则列表
    const response = await proxy.$api.getAssignmentRules({
      page: pagination.page,
      size: pagination.size,
      status: filter.status || undefined,
      keyword: filter.keyword || undefined
    })

    // 获取规则列表并按优先级排序
    rules.value = response.records.sort((a: AssignmentRuleDTO, b: AssignmentRuleDTO) => a.ruleOrder - b.ruleOrder)
    pagination.total = response.total
  } catch (error) {
    console.error('加载规则失败:', error)
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}
    rules.value = filtered.slice(start, end)
  } catch (error) {
    console.error('加载规则失败:', error)
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 加载审核组列表
const loadAuditGroups = async () => {
  try {
    // TODO: 调用真实API
    // const response = await proxy.$api.getActiveAuditGroups()

    // 模拟数据
    auditGroups.value = [
      { id: 'AG001', groupName: '第一审核组', groupCode: 'GROUP001' },
      { id: 'AG002', groupName: '第二审核组', groupCode: 'GROUP002' },
      { id: 'AG003', groupName: '第三审核组', groupCode: 'GROUP003' },
      { id: 'AG004', groupName: '第四审核组', groupCode: 'GROUP004' }
    ]
  } catch (error) {
    console.error('加载审核组失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadData()
}

// 分页变化
const handlePageChange = (page: number) => {
  pagination.page = page
  loadData()
}

const handleSizeChange = (size: number) => {
  pagination.size = size
  pagination.page = 1
  loadData()
}

// 打开对话框
const openDialog = (action: 'add' | 'edit', row?: AssignmentRuleDTO) => {
  dialogAction.value = action
  if (action === 'edit' && row) {
    currentRuleId.value = row.id
    Object.assign(form, {
      ruleName: row.ruleName,
      ruleCode: row.ruleCode,
      diseaseCategory: row.diseaseCategory || '',
      hospitalArea: row.hospitalArea || '',
      department: row.department || '',
      assignStrategy: row.assignStrategy,
      targetGroupId: row.targetGroupId || '',
      priority: row.priority,
      deadlineHours: row.deadlineHours || 24,
      status: row.status,
      ruleOrder: row.ruleOrder
    })
  } else {
    currentRuleId.value = undefined
    resetForm()
  }
  dialogVisible.value = true
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    ruleName: '',
    ruleCode: '',
    diseaseCategory: '',
    hospitalArea: '',
    department: '',
    assignStrategy: 'LEAST_TASKS',
    targetGroupId: '',
    priority: 'NORMAL',
    deadlineHours: 24,
    status: 'ACTIVE',
    ruleOrder: 1
  })
  formRef.value?.clearValidate()
}

// 关闭对话框
const handleDialogClose = () => {
  resetForm()
  dialogVisible.value = false
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    submitting.value = true

    if (dialogAction.value === 'add') {
      await proxy.$api.createAssignmentRule(form)
      ElMessage.success('规则创建成功')
    } else {
      // 编辑模式，找到规则ID
      const ruleId = currentRuleId.value
      if (ruleId) {
        await proxy.$api.updateAssignmentRule(ruleId, form)
        ElMessage.success('规则更新成功')
      }
    }

    dialogVisible.value = false
    loadData()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error(typeof error === 'string' ? error : '操作失败')
  } finally {
    submitting.value = false
  }
}

// 当前编辑的规则ID
const currentRuleId = ref<string>()

// 切换状态
const handleToggleStatus = async (row: AssignmentRuleDTO) => {
  try {
    // 标记加载状态
    row._toggling = true

    await proxy.$api.toggleAssignmentRule(row.id)

    ElMessage.success(`规则已${row.status === 'ACTIVE' ? '启用' : '停用'}`)
    loadData()
  } catch (error) {
    // 回滚状态
    row.status = row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    console.error('切换状态失败:', error)
    ElMessage.error(typeof error === 'string' ? error : '操作失败')
  } finally {
    row._toggling = false
  }
}

// 删除规则
const handleDelete = async (row: AssignmentRuleDTO) => {
  try {
    await ElMessageBox.confirm('确认删除该规则？删除后不可恢复。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await proxy.$api.deleteAssignmentRule(row.id)

    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 响应式布局检测
const isMobile = ref(window.innerWidth <= 768)

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  loadAuditGroups()
  loadData()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="less">
.rule-management-container {
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

  .main-card {
    :deep(.el-card__body) {
      padding: 20px;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .filter-group {
        display: flex;
        gap: 10px;
      }
    }

    .match-conditions {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;

      .text-muted {
        color: #909399;
        font-size: 13px;
      }
    }

    .pagination {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }

  .rule-dialog {
    .strategy-option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      .strategy-desc {
        font-size: 12px;
        color: #909399;
      }
    }

    .rule-tips {
      margin-top: 10px;

      ul {
        margin: 8px 0 0 0;
        padding-left: 20px;

        li {
          margin: 4px 0;
          font-size: 13px;
          color: #606266;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .rule-management-container {
    padding: 12px;

    .header-actions {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .main-card {
      :deep(.el-card__body) {
        padding: 12px;
      }

      .table-header {
        flex-direction: column;
        gap: 10px;

        .filter-group {
          flex-wrap: wrap;
          width: 100%;

          .el-select,
          .el-input {
            width: 100% !important;
          }
        }
      }
    }

    .rule-dialog {
      :deep(.el-row) {
        .el-col {
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
