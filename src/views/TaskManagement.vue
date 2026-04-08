<!--
 * Task Management Page
 * 任务分配管理页面
 * @author: SAKANA267
 * @since: 2026-04-07
-->
<template>
  <div class="task-management-container">
    <!-- 顶部操作栏 -->
    <div class="header-actions">
      <div class="title-section">
        <h2>任务分配管理</h2>
        <p class="subtitle">管理报卡的分配与处理</p>
      </div>
      <div class="action-buttons">
        <el-button type="primary" :icon="Refresh" @click="refreshData">刷新</el-button>
        <el-button type="success" :icon="MagicStick" @click="handleAutoAssign">自动分配</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="12" :sm="6" v-for="(stat, index) in stats" :key="index">
        <div class="stat-card" :class="stat.type">
          <div class="stat-icon">
            <component :is="stat.icon" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 主内容区域 -->
    <el-card class="main-card" shadow="never">
      <el-tabs v-model="activeTab" class="task-tabs">
        <!-- 待分配报卡 -->
        <el-tab-pane label="待分配报卡" name="pending">
          <template #label>
            <span class="tab-label">
              <el-icon><Document /></el-icon>
              待分配报卡
              <el-badge :value="pendingCount" :max="99" class="tab-badge" />
            </span>
          </template>

          <div class="table-header">
            <div class="search-box">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索住院号、患者姓名、诊断名称"
                :prefix-icon="Search"
                clearable
                @clear="handlePendingSearch"
                @keyup.enter="handlePendingSearch"
                style="width: 300px"
              />
            </div>
            <div class="filter-group">
              <el-select
                v-model="pendingFilter.diseaseCategory"
                placeholder="病种分类"
                clearable
                @change="handlePendingSearch"
                style="width: 140px"
              >
                <el-option
                  v-for="item in diseaseCategories"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
              <el-select
                v-model="pendingFilter.hospitalArea"
                placeholder="院区"
                clearable
                @change="handlePendingSearch"
                style="width: 100px"
              >
                <el-option
                  v-for="item in hospitalAreas"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
              <el-button
                type="primary"
                :icon="Plus"
                @click="handleBatchAssign"
                :disabled="selectedCards.length === 0"
              >
                批量分配 ({{ selectedCards.length }})
              </el-button>
            </div>
          </div>

          <el-table
            :data="pendingCards"
            v-loading="pendingLoading"
            @selection-change="handleSelectionChange"
            stripe
            style="width: 100%"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="inpatientNo" label="住院号" width="120" />
            <el-table-column prop="name" label="患者姓名" width="100" />
            <el-table-column prop="diagnosisName" label="诊断名称" min-width="150" />
            <el-table-column prop="hospitalArea" label="院区" width="80" />
            <el-table-column prop="department" label="科室" width="120" />
            <el-table-column prop="fillDate" label="填卡日期" width="110" />
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  :icon="Share"
                  @click="openAssignDialog(scope.row)"
                >
                  分配
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            v-model:current-page="pendingPagination.page"
            v-model:page-size="pendingPagination.size"
            :total="pendingPagination.total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handlePendingSizeChange"
            @current-change="handlePendingPageChange"
            class="pagination"
          />
        </el-tab-pane>

        <!-- 已分配任务 -->
        <el-tab-pane label="已分配任务" name="assigned">
          <template #label>
            <span class="tab-label">
              <el-icon><Checked /></el-icon>
              已分配任务
              <el-badge :value="assignedCount" :max="999" class="tab-badge" />
            </span>
          </template>

          <div class="table-header">
            <div class="filter-group">
              <el-select
                v-model="taskFilter.status"
                placeholder="任务状态"
                clearable
                @change="handleTaskSearch"
                style="width: 120px"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select
                v-model="taskFilter.priority"
                placeholder="优先级"
                clearable
                @change="handleTaskSearch"
                style="width: 120px"
              >
                <el-option
                  v-for="item in priorityOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select
                v-model="taskFilter.auditGroupId"
                placeholder="审核组"
                clearable
                filterable
                @change="handleTaskSearch"
                style="width: 150px"
              >
                <el-option
                  v-for="group in auditGroups"
                  :key="group.id"
                  :label="group.groupName"
                  :value="group.id"
                />
              </el-select>
              <el-input
                v-model="taskFilter.keyword"
                placeholder="搜索关键词"
                :prefix-icon="Search"
                clearable
                @clear="handleTaskSearch"
                @keyup.enter="handleTaskSearch"
                style="width: 200px"
              />
            </div>
          </div>

          <el-table
            :data="assignedTasks"
            v-loading="taskLoading"
            stripe
            style="width: 100%"
          >
            <el-table-column prop="id" label="任务ID" width="100" />
            <el-table-column prop="reportCardInpatientNo" label="住院号" width="110" />
            <el-table-column prop="reportCardPatientName" label="患者姓名" width="90" />
            <el-table-column prop="reportCardDiagnosisName" label="诊断名称" min-width="120" />
            <el-table-column prop="auditGroupName" label="审核组" width="110" />
            <el-table-column label="状态" width="90">
              <template #default="scope">
                <el-tag :type="getStatusTagType(scope.row.status)" size="small">
                  {{ scope.row.statusDescription }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="优先级" width="80">
              <template #default="scope">
                <el-tag :type="getPriorityTagType(scope.row.priority)" size="small">
                  {{ scope.row.priorityDescription }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="assignTime" label="分配时间" width="155" />
            <el-table-column prop="deadline" label="截止时间" width="155">
              <template #default="scope">
                <span :class="{ 'overdue': isOverdue(scope.row.deadline, scope.row.status) }">
                  {{ scope.row.deadline ? formatDate(scope.row.deadline) : '-' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  :icon="View"
                  @click="handleViewDetail(scope.row)"
                  link
                >
                  详情
                </el-button>
                <el-button
                  type="warning"
                  size="small"
                  :icon="RefreshRight"
                  @click="openReassignDialog(scope.row)"
                  link
                  :disabled="scope.row.status === 'COMPLETED' || scope.row.status === 'CANCELLED'"
                >
                  重新分配
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  :icon="Close"
                  @click="handleCancelTask(scope.row)"
                  link
                  :disabled="scope.row.status === 'COMPLETED' || scope.row.status === 'CANCELLED'"
                >
                  取消
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            v-model:current-page="taskPagination.page"
            v-model:page-size="taskPagination.size"
            :total="taskPagination.total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleTaskSizeChange"
            @current-change="handleTaskPageChange"
            class="pagination"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 分配对话框 -->
    <AssignmentDialog
      v-model="assignDialogVisible"
      :report-card="currentReportCard"
      :audit-groups="auditGroups"
      :assignment-id="currentAssignmentId"
      @submit="handleAssignSubmit"
    />

    <!-- 任务详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="任务详情"
      width="600px"
      class="detail-dialog"
    >
      <div v-if="currentTaskDetail" class="task-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="任务ID">{{ currentTaskDetail.id }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTagType(currentTaskDetail.status)">
              {{ currentTaskDetail.statusDescription }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="优先级">
            <el-tag :type="getPriorityTagType(currentTaskDetail.priority)">
              {{ currentTaskDetail.priorityDescription }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="审核组">{{ currentTaskDetail.auditGroupName }}</el-descriptions-item>
          <el-descriptions-item label="分配人">{{ currentTaskDetail.assignerName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="处理人">{{ currentTaskDetail.accepterName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="分配时间">{{ formatDateTime(currentTaskDetail.assignTime) }}</el-descriptions-item>
          <el-descriptions-item label="截止时间">
            <span :class="{ 'overdue': isOverdue(currentTaskDetail.deadline, currentTaskDetail.status) }">
              {{ currentTaskDetail.deadline ? formatDateTime(currentTaskDetail.deadline) : '-' }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="报卡住院号" :span="2">{{ currentTaskDetail.reportCardInpatientNo }}</el-descriptions-item>
          <el-descriptions-item label="患者姓名" :span="2">{{ currentTaskDetail.reportCardPatientName }}</el-descriptions-item>
          <el-descriptions-item label="诊断名称" :span="2">{{ currentTaskDetail.reportCardDiagnosisName }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2" v-if="currentTaskDetail.remark">
            {{ currentTaskDetail.remark }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, markRaw } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Document,
  Checked,
  Plus,
  Share,
  View,
  RefreshRight,
  Close,
  Refresh,
  MagicStick,
  Search,
  Clock,
  Finished,
  Warning
} from '@element-plus/icons-vue'
import { getCurrentInstance } from 'vue'
import AssignmentDialog from '@/components/AssignmentDialog.vue'
import type { AssignmentDTO, AssignmentPriorityEnum, AssignmentStatusEnum } from '@/api/types'

const { proxy } = getCurrentInstance() as any

// 当前激活的标签页
const activeTab = ref('pending')

// 统计数据
const stats = ref([
  { label: '待分配', value: 0, icon: markRaw(Document), type: 'primary' },
  { label: '待处理', value: 0, icon: markRaw(Clock), type: 'warning' },
  { label: '处理中', value: 0, icon: markRaw(MagicStick), type: 'primary' },
  { label: '已完成', value: 0, icon: markRaw(Finished), type: 'success' }
])

// 待分配报卡数据
const pendingCards = ref<any[]>([])
const pendingLoading = ref(false)
const searchKeyword = ref('')
const pendingFilter = reactive({
  diseaseCategory: '',
  hospitalArea: ''
})
const selectedCards = ref<any[]>([])
const pendingPagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 已分配任务数据
const assignedTasks = ref<AssignmentDTO[]>([])
const taskLoading = ref(false)
const taskFilter = reactive({
  status: '' as AssignmentStatusEnum | '',
  priority: '' as AssignmentPriorityEnum | '',
  auditGroupId: '',
  keyword: ''
})
const taskPagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 审核组列表
const auditGroups = ref<any[]>([])

// 对话框状态
const assignDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const currentReportCard = ref<any>({})
const currentAssignmentId = ref<string>()
const currentTaskDetail = ref<AssignmentDTO>()

// 待分配数量
const pendingCount = computed(() => pendingPagination.total)

// 已分配数量
const assignedCount = computed(() => taskPagination.total)

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

// 状态选项
const statusOptions = [
  { label: '待处理', value: 'PENDING' },
  { label: '处理中', value: 'IN_PROGRESS' },
  { label: '已完成', value: 'COMPLETED' },
  { label: '已取消', value: 'CANCELLED' }
]

// 优先级选项
const priorityOptions = [
  { label: '低', value: 'LOW' },
  { label: '普通', value: 'NORMAL' },
  { label: '高', value: 'HIGH' },
  { label: '紧急', value: 'URGENT' }
]

// 获取状态标签类型
const getStatusTagType = (status: AssignmentStatusEnum) => {
  const map: Record<AssignmentStatusEnum, string> = {
    PENDING: 'warning',
    IN_PROGRESS: 'primary',
    COMPLETED: 'success',
    CANCELLED: 'info'
  }
  return map[status] || ''
}

// 获取优先级标签类型
const getPriorityTagType = (priority: AssignmentPriorityEnum) => {
  const map: Record<AssignmentPriorityEnum, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
    LOW: 'info',
    NORMAL: 'info',
    HIGH: 'warning',
    URGENT: 'danger'
  }
  return map[priority] || 'info'
}

// 判断是否超时
const isOverdue = (deadline: string | undefined, status: AssignmentStatusEnum) => {
  if (!deadline || status === 'COMPLETED' || status === 'CANCELLED') return false
  return new Date(deadline) < new Date()
}

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 格式化完整日期时间
const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 加载待分配报卡（从真实API）
const loadPendingCards = async () => {
  pendingLoading.value = true
  try {
    const response = await proxy.$api.getUnassignedReportCards({
      page: pendingPagination.page,
      size: pendingPagination.size,
      keyword: searchKeyword.value || undefined,
      diseaseCategory: pendingFilter.diseaseCategory || undefined,
      hospitalArea: pendingFilter.hospitalArea || undefined
    })

    pendingCards.value = response.records.map((card: any) => ({
      ...card,
      // 转换性别显示
      genderDisplay: card.gender === 'MALE' ? '男' : card.gender === 'FEMALE' ? '女' : card.gender
    }))
    pendingPagination.total = response.total
  } catch (error) {
    console.error('加载待分配报卡失败:', error)
    ElMessage.error('加载失败')
  } finally {
    pendingLoading.value = false
  }
}

// 加载已分配任务（从真实API）
const loadAssignedTasks = async () => {
  taskLoading.value = true
  try {
    const response = await proxy.$api.getPendingAssignments({
      page: taskPagination.page,
      size: taskPagination.size,
      status: taskFilter.status || undefined,
      priority: taskFilter.priority || undefined,
      auditGroupId: taskFilter.auditGroupId || undefined,
      keyword: taskFilter.keyword || undefined
    })

    // 转换数据以匹配显示需求
    assignedTasks.value = response.records.map((task: AssignmentDTO) => ({
      ...task,
      reportCardInpatientNo: task.reportCardInpatientNo || '-',
      reportCardPatientName: task.reportCardPatientName || '-',
      reportCardDiagnosisName: task.reportCardDiagnosisName || '-'
    }))
    taskPagination.total = response.total

    // 更新统计数据
    updateStatsFromTasks(response.records)
  } catch (error) {
    console.error('加载已分配任务失败:', error)
    ElMessage.error('加载失败')
  } finally {
    taskLoading.value = false
  }
}

// 从任务数据更新统计
const updateStatsFromTasks = (tasks: AssignmentDTO[]) => {
  stats.value[1].value = tasks.filter((t) => t.status === 'PENDING').length
  stats.value[2].value = tasks.filter((t) => t.status === 'IN_PROGRESS').length
  stats.value[3].value = tasks.filter((t) => t.status === 'COMPLETED').length
}

// 加载审核组列表
const loadAuditGroups = async () => {
  try {
    const response = await proxy.$api.getActiveAuditGroups()
    auditGroups.value = response.map((group: any) => ({
      id: group.id,
      groupName: group.groupName,
      groupCode: group.groupCode,
      memberCount: group.memberCount || 0
    }))
  } catch (error) {
    console.error('加载审核组失败:', error)
  }
}

// 更新统计数据
const updateStats = () => {
  stats.value[0].value = pendingPagination.total
}

// 刷新数据
const refreshData = () => {
  loadPendingCards()
  loadAssignedTasks()
  updateStats()
  ElMessage.success('数据已刷新')
}

// 搜索待分配报卡
const handlePendingSearch = () => {
  pendingPagination.page = 1
  loadPendingCards()
}

// 搜索已分配任务
const handleTaskSearch = () => {
  taskPagination.page = 1
  loadAssignedTasks()
}

// 分配单条报卡
const openAssignDialog = (row: any) => {
  currentReportCard.value = { ...row }
  currentAssignmentId.value = undefined
  assignDialogVisible.value = true
}

// 批量分配
const handleBatchAssign = async () => {
  if (selectedCards.value.length === 0) {
    ElMessage.warning('请先选择要分配的报卡')
    return
  }

  try {
    await ElMessageBox.confirm(`确认批量分配 ${selectedCards.value.length} 条报卡？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })

    // TODO: 实现批量分配 - 这里简化为逐个分配
    ElMessage.info('批量分配功能开发中，请逐个分配')
  } catch (error) {
    // 用户取消
  }
}

// 重新分配
const openReassignDialog = (row: AssignmentDTO) => {
  currentReportCard.value = {
    id: row.reportCardId,
    inpatientNo: row.reportCardInpatientNo,
    patientName: row.reportCardPatientName,
    diagnosisName: row.reportCardDiagnosisName,
    hospitalArea: '',
    department: ''
  }
  currentAssignmentId.value = row.id
  assignDialogVisible.value = true
}

// 提交分配
const handleAssignSubmit = async (data: any) => {
  try {
    if (currentAssignmentId.value) {
      // 重新分配 - 支持修改截止时间和优先级
      await proxy.$api.reassignTask(currentAssignmentId.value, {
        newAuditGroupId: data.auditGroupId,
        priority: data.priority,
        deadline: data.deadline, // 直接使用表单的 deadline 值
        remark: data.remark
      })
      ElMessage.success('重新分配成功')
    } else {
      // 首次分配 - 直接传递整个 data 对象（包含原始 deadline）
      await proxy.$api.assignTask(data)
      ElMessage.success('分配成功')
    }
    refreshData()
  } catch (error) {
    console.error('分配失败:', error)
    ElMessage.error(typeof error === 'string' ? error : '分配失败')
  }
}

// 查看详情
const handleViewDetail = async (row: AssignmentDTO) => {
  try {
    const detail = await proxy.$api.getAssignmentById(row.id)
    currentTaskDetail.value = detail
    detailDialogVisible.value = true
  } catch (error) {
    console.error('获取任务详情失败:', error)
    ElMessage.error('获取详情失败')
  }
}

// 取消任务
const handleCancelTask = async (row: AssignmentDTO) => {
  try {
    await ElMessageBox.confirm('确认取消该任务？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await proxy.$api.cancelTask({
      assignmentId: row.id,
      status: 'CANCELLED',
      version: row.version,
      remark: '用户手动取消'
    })

    ElMessage.success('任务已取消')
    refreshData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消任务失败:', error)
      ElMessage.error(typeof error === 'string' ? error : '取消失败')
    }
  }
}

// 自动分配
const handleAutoAssign = async () => {
  try {
    if (selectedCards.value.length === 0) {
      ElMessageBox.confirm(
        '自动分配将根据预设规则分配所有待分配报卡，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }
      ).then(async () => {
        // 自动分配所有待分配报卡
        const response = await proxy.$api.getUnassignedReportCards({ page: 1, size: 1000 })
        let successCount = 0
        let failCount = 0

        for (const card of response.records) {
          try {
            await proxy.$api.autoAssign({
              reportCardId: card.id,
              diseaseCategory: undefined, // 后端根据报卡信息自动匹配
              hospitalArea: card.hospitalArea,
              department: card.department,
              assignerId: 'current-user-id' // TODO: 从用户信息获取
            })
            successCount++
          } catch (error) {
            console.error(`自动分配失败 ${card.id}:`, error)
            failCount++
          }
        }

        ElMessage.success(`自动分配完成：成功 ${successCount} 条，失败 ${failCount} 条`)
        refreshData()
      }).catch(() => {})
    } else {
      // 自动分配选中的报卡
      let successCount = 0
      let failCount = 0

      for (const card of selectedCards.value) {
        try {
          await proxy.$api.autoAssign({
            reportCardId: card.id,
            diseaseCategory: undefined,
            hospitalArea: card.hospitalArea,
            department: card.department,
            assignerId: 'current-user-id' // TODO: 从用户信息获取
          })
          successCount++
        } catch (error) {
          console.error(`自动分配失败 ${card.id}:`, error)
          failCount++
        }
      }

      ElMessage.success(`自动分配完成：成功 ${successCount} 条，失败 ${failCount} 条`)
      selectedCards.value = []
      refreshData()
    }
  } catch (error) {
    console.error('自动分配失败:', error)
    ElMessage.error('自动分配失败')
  }
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedCards.value = selection
}

// 分页变化
const handlePendingPageChange = (page: number) => {
  pendingPagination.page = page
  loadPendingCards()
}

const handlePendingSizeChange = (size: number) => {
  pendingPagination.size = size
  pendingPagination.page = 1
  loadPendingCards()
}

const handleTaskPageChange = (page: number) => {
  taskPagination.page = page
  loadAssignedTasks()
}

const handleTaskSizeChange = (size: number) => {
  taskPagination.size = size
  taskPagination.page = 1
  loadAssignedTasks()
}

// 响应式布局检测
const isMobile = ref(window.innerWidth <= 768)

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  loadAuditGroups()
  loadPendingCards()
  loadAssignedTasks()
  updateStats()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="less">
.task-management-container {
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

    .action-buttons {
      display: flex;
      gap: 10px;
    }
  }

  .stats-row {
    margin-bottom: 20px;

    .stat-card {
      background: white;
      border-radius: 8px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      &.primary .stat-icon {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.warning .stat-icon {
        background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
      }

      &.success .stat-icon {
        background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
      }

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
      }

      .stat-content {
        flex: 1;

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }

  .main-card {
    :deep(.el-card__body) {
      padding: 0;
    }

    .task-tabs {
      padding: 20px;

      .tab-label {
        display: flex;
        align-items: center;
        gap: 6px;

        .tab-badge {
          margin-left: 4px;
        }
      }

      .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        flex-wrap: wrap;
        gap: 12px;

        .search-box {
          flex: 1;
          min-width: 280px;
        }

        .filter-group {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
      }

      .pagination {
        display: flex;
        justify-content: center;
        margin-top: 20px;
      }
    }
  }

  .overdue {
    color: #f56c6c;
    font-weight: bold;
  }
}

@media (max-width: 768px) {
  .task-management-container {
    padding: 12px;

    .header-actions {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;

      .action-buttons {
        width: 100%;

        .el-button {
          flex: 1;
        }
      }
    }

    .stats-row {
      .el-col {
        margin-bottom: 10px;
      }

      .stat-card {
        padding: 12px;

        .stat-icon {
          width: 40px;
          height: 40px;
          font-size: 20px;
        }

        .stat-content .stat-value {
          font-size: 20px;
        }
      }
    }

    .main-card .task-tabs {
      padding: 12px;

      .table-header {
        flex-direction: column;

        .search-box,
        .filter-group,
        .el-select,
        .el-input {
          width: 100% !important;
        }
      }
    }
  }
}
</style>
