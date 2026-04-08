<!--
 * Task Assignment Dialog Component
 * 任务分配对话框组件
 * @author: SAKANA267
 * @since: 2026-04-07
-->
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '重新分配任务' : '手动分配任务'"
    :width="isMobile ? '95%' : '500px'"
    :fullscreen="isMobile"
    @close="handleClose"
    class="assignment-dialog"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-position="top" label-width="100px">
      <el-form-item label="报卡信息" prop="reportCardInfo">
        <div class="report-card-info">
          <p><strong>住院号:</strong> {{ reportCard.inpatientNo }}</p>
          <p><strong>患者姓名:</strong> {{ reportCard.patientName }}</p>
          <p><strong>诊断名称:</strong> {{ reportCard.diagnosisName }}</p>
          <p>
            <strong>院区/科室:</strong> {{ reportCard.hospitalArea }} / {{ reportCard.department }}
          </p>
        </div>
      </el-form-item>

      <el-form-item label="审核组" prop="auditGroupId">
        <el-select
          v-model="form.auditGroupId"
          placeholder="请选择审核组"
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="group in auditGroups"
            :key="group.id"
            :label="`${group.groupName} (${group.groupCode})`"
            :value="group.id"
          >
            <div class="audit-group-option">
              <span>{{ group.groupName }}</span>
              <span class="group-code">{{ group.groupCode }}</span>
              <el-tag v-if="group.memberCount" size="small" type="info">
                {{ group.memberCount }}人
              </el-tag>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="优先级" prop="priority">
        <el-select v-model="form.priority" placeholder="请选择优先级" style="width: 100%">
          <el-option
            v-for="item in priorityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <div class="priority-option">
              <el-tag :type="getPriorityTagType(item.value)" size="small">
                {{ item.label }}
              </el-tag>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="截止时间" prop="deadline">
        <el-date-picker
          v-model="form.deadline"
          type="datetime"
          placeholder="请选择截止时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DDTHH:mm:ss"
          style="width: 100%"
          :disabled-date="disabledDate"
          :disabled-hours="disabledHours"
          :disabled-minutes="disabledMinutes"
        />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入备注信息（可选）"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">
        {{ isEdit ? '重新分配' : '确认分配' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { AssignmentPriorityEnum } from '@/api/types'

// 定义组件属性
interface ReportCard {
  id: string
  inpatientNo: string
  patientName: string
  diagnosisName: string
  hospitalArea: string
  department: string
}

interface AuditGroup {
  id: string
  groupName: string
  groupCode: string
  memberCount?: number
}

interface Props {
  modelValue: boolean
  reportCard: ReportCard
  auditGroups: AuditGroup[]
  assignmentId?: string // 如果有值，则为重新分配
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  auditGroups: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: any]
}>()

// 是否为编辑模式（重新分配）
const isEdit = computed(() => !!props.assignmentId)

// 对话框可见性
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 表单数据
const form = reactive({
  auditGroupId: '',
  priority: 'NORMAL' as AssignmentPriorityEnum,
  deadline: '',
  remark: ''
})

// 表单引用
const formRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)

// 优先级选项
const priorityOptions = [
  { label: '低', value: 'LOW' as AssignmentPriorityEnum },
  { label: '普通', value: 'NORMAL' as AssignmentPriorityEnum },
  { label: '高', value: 'HIGH' as AssignmentPriorityEnum },
  { label: '紧急', value: 'URGENT' as AssignmentPriorityEnum }
]

// 表单验证规则
const rules: FormRules = {
  auditGroupId: [{ required: true, message: '请选择审核组', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
  deadline: [{ required: true, message: '请选择截止时间', trigger: 'change' }]
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

// 禁用过去的日期
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

// 禁用小时（过去的小时）
const disabledHours = () => {
  const hours: number[] = []
  const now = new Date()
  const selectedDate = form.deadline ? new Date(form.deadline) : null

  if (selectedDate) {
    const isToday = selectedDate.toDateString() === now.toDateString()
    if (isToday) {
      for (let i = 0; i < now.getHours(); i++) {
        hours.push(i)
      }
    }
  }
  return hours
}

// 禁用分钟
const disabledMinutes = () => {
  const minutes: number[] = []
  const now = new Date()
  const selectedDate = form.deadline ? new Date(form.deadline) : null

  if (selectedDate) {
    const isToday = selectedDate.toDateString() === now.toDateString()
    const isSameHour = isToday && selectedDate.getHours() === now.getHours()
    if (isSameHour) {
      for (let i = 0; i <= now.getMinutes(); i++) {
        minutes.push(i)
      }
    }
  }
  return minutes
}

// 重置表单
const resetForm = () => {
  form.auditGroupId = ''
  form.priority = 'NORMAL'
  form.deadline = ''
  form.remark = ''
  formRef.value?.clearValidate()
}

// 关闭对话框
const handleClose = () => {
  resetForm()
  dialogVisible.value = false
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // 直接使用日期选择器的值，不做任何转换
    // value-format: YYYY-MM-DDTHH:mm:ss
    const submitData = {
      reportCardId: props.reportCard.id,
      auditGroupId: form.auditGroupId,
      priority: form.priority,
      deadline: form.deadline, // 直接使用表单值
      remark: form.remark || undefined
    }

    console.log('提交的 deadline 原始值:', form.deadline)
    console.log('提交的完整数据:', submitData)

    loading.value = true

    // 触发提交事件
    emit('submit', submitData)

    // 延迟关闭，让父组件处理完成
    setTimeout(() => {
      loading.value = false
      handleClose()
    }, 500)
  } catch (error) {
    console.error('表单验证失败:', error)
    loading.value = false
  }
}

// 响应式布局检测
const isMobile = ref(window.innerWidth <= 768)

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 暴露方法
defineExpose({
  resetForm
})
</script>

<style scoped lang="less">
.assignment-dialog {
  .report-card-info {
    background: #f5f7fa;
    padding: 12px;
    border-radius: 4px;
    font-size: 14px;

    p {
      margin: 4px 0;
      color: #606266;

      strong {
        color: #303133;
        margin-right: 8px;
      }
    }
  }

  .audit-group-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .group-code {
      color: #909399;
      font-size: 12px;
      margin: 0 8px;
    }
  }

  .priority-option {
    display: flex;
    align-items: center;
  }
}

@media (max-width: 768px) {
  .assignment-dialog {
    :deep(.el-dialog__body) {
      padding: 16px;
    }

    .report-card-info {
      p {
        font-size: 13px;
      }
    }
  }
}
</style>
