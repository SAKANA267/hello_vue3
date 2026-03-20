<!--
 * CommonSearch.vue
 * @description 通用搜索组件，支持多种字段类型和操作按钮
 * @author: Claude Code
 * @since: 2026-03-12
-->
<template>
  <div class="common-search">
    <el-form :inline="!isMobile" :model="formData" class="search-form">
      <!-- 左侧操作按钮（如新增按钮） -->
      <el-form-item v-if="$slots.actions">
        <slot name="actions" />
      </el-form-item>

      <!-- 统一关键词输入框 -->
      <el-form-item v-if="showKeyword">
        <el-input
          v-model="formData.keyWord"
          :placeholder="keywordPlaceholder || '请输入关键词搜索'"
          :prefix-icon="Search"
          :clearable="true"
          :style="{ width: keywordWidth || '200px' }"
        />
      </el-form-item>

      <!-- 统一时间范围筛选 -->
      <el-form-item v-if="showTimeRange" label="时间范围">
        <el-date-picker
          v-model="formData.timeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DDTHH:mm:ss"
          :default-time="defaultTime"
          :clearable="true"
          :style="{ width: timeRangeWidth || '380px' }"
        />
      </el-form-item>

      <!-- 动态渲染搜索字段 -->
      <template v-for="field in fields" :key="field.prop">
        <el-form-item :label="field.label">
          <!-- 输入框 -->
          <el-input
            v-if="field.type === 'input'"
            v-model="formData[field.prop]"
            :placeholder="field.placeholder || `请输入${field.label}`"
            :prefix-icon="field.icon"
            :clearable="field.clearable !== false"
            :style="{ width: field.width || '200px' }"
          />

          <!-- 下拉选择 -->
          <el-select
            v-else-if="field.type === 'select'"
            v-model="formData[field.prop]"
            :placeholder="field.placeholder || `请选择${field.label}`"
            :clearable="field.clearable !== false"
            :style="{ width: field.width || '120px' }"
          >
            <el-option
              v-for="option in field.options"
              :key="typeof option === 'string' ? option : option.value"
              :label="typeof option === 'string' ? option : option.label"
              :value="typeof option === 'string' ? option : option.value"
            />
          </el-select>

          <!-- 日期选择器 -->
          <el-date-picker
            v-else-if="field.type === 'date'"
            v-model="formData[field.prop]"
            type="date"
            :placeholder="field.placeholder || `请选择${field.label}`"
            :format="field.format || 'YYYY-MM-DD'"
            :value-format="field.valueFormat || 'YYYY-MM-DD'"
            :clearable="field.clearable !== false"
            :style="{ width: field.width || '150px' }"
          />

          <!-- 日期时间选择器 -->
          <el-date-picker
            v-else-if="field.type === 'datetime'"
            v-model="formData[field.prop]"
            type="datetime"
            :placeholder="field.placeholder || `请选择${field.label}`"
            :format="field.format || 'YYYY-MM-DD HH:mm:ss'"
            :value-format="field.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
            :clearable="field.clearable !== false"
            :style="{ width: field.width || '200px' }"
          />

          <!-- 日期范围选择器 -->
          <el-date-picker
            v-else-if="field.type === 'date-range'"
            v-model="formData[field.prop]"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :format="field.format || 'YYYY-MM-DD'"
            :value-format="field.valueFormat || 'YYYY-MM-DD'"
            :clearable="field.clearable !== false"
            :style="{ width: field.width || '280px' }"
          />

          <!-- 日期时间范围选择器 -->
          <el-date-picker
            v-else-if="field.type === 'datetime-range'"
            v-model="formData[field.prop]"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :format="field.format || 'YYYY-MM-DD HH:mm:ss'"
            :value-format="field.valueFormat || 'YYYY-MM-DDTHH:mm:ss'"
            :default-time="field.defaultTime"
            :clearable="field.clearable !== false"
            :style="{ width: field.width || '380px' }"
          />
        </el-form-item>
      </template>

      <!-- 查询按钮 -->
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>

      <!-- 重置按钮 -->
      <el-form-item v-if="showReset">
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>

      <!-- 额外按钮插槽 -->
      <slot name="extra-buttons" />
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref, onMounted, onUnmounted } from 'vue'
import { Search } from '@element-plus/icons-vue'

// 定义字段类型
export interface SelectOption {
  label: string
  value: string | number
}

export interface BaseField {
  prop: string
  label: string
  placeholder?: string
  width?: string
  clearable?: boolean
}

export interface InputField extends BaseField {
  type: 'input'
  icon?: any
}

export interface SelectField extends BaseField {
  type: 'select'
  options?: (string | SelectOption)[]
}

export interface DateField extends BaseField {
  type: 'date' | 'datetime'
  format?: string
  valueFormat?: string
}

export interface DateRangeField extends BaseField {
  type: 'date-range' | 'datetime-range'
  format?: string
  valueFormat?: string
  defaultTime?: [Date, Date]
}

export type SearchField = InputField | SelectField | DateField | DateRangeField

interface Props {
  fields: SearchField[]
  showReset?: boolean
  showKeyword?: boolean
  showTimeRange?: boolean
  keywordPlaceholder?: string
  keywordWidth?: string
  timeRangeWidth?: string
  modelValue?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  showReset: true,
  showKeyword: true,
  showTimeRange: true,
  keywordPlaceholder: '请输入关键词搜索',
  keywordWidth: '200px',
  timeRangeWidth: '380px',
  modelValue: () => ({})
})

const emit = defineEmits<{
  search: [data: Record<string, any>]
  reset: []
  'update:modelValue': [data: Record<string, any>]
}>()

// 表单数据
const formData = reactive<Record<string, any>>({})

// 响应式状态
const isMobile = ref(window.innerWidth <= 768)

// 处理窗口大小变化
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 默认时间范围选择器的默认时间
const defaultTime: [Date, Date] = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]

// 初始化表单数据
const initFormData = () => {
  // 初始化关键词字段
  if (props.showKeyword && formData.keyWord === undefined) {
    formData.keyWord = props.modelValue.keyWord ?? ''
  }

  // 初始化时间范围字段
  if (props.showTimeRange && formData.timeRange === undefined) {
    formData.timeRange = props.modelValue.timeRange ?? null
  }

  // 初始化自定义字段
  props.fields.forEach(field => {
    if (formData[field.prop] === undefined) {
      formData[field.prop] = props.modelValue[field.prop] ?? getFieldDefault(field)
    }
  })
}

// 获取字段默认值
const getFieldDefault = (field: SearchField) => {
  switch (field.type) {
    case 'date-range':
    case 'datetime-range':
      return null
    default:
      return ''
  }
}

initFormData()

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  newVal => {
    Object.keys(newVal).forEach(key => {
      formData[key] = newVal[key]
    })
  },
  { deep: true }
)

// 监听表单数据变化，同步到父组件
watch(
  formData,
  newVal => {
    emit('update:modelValue', { ...newVal })
  },
  { deep: true }
)

// 查询按钮点击
const handleSearch = () => {
  emit('search', { ...formData })
}

// 重置按钮点击
const handleReset = () => {
  // 重置关键词字段
  if (props.showKeyword) {
    formData.keyWord = ''
  }

  // 重置时间范围字段
  if (props.showTimeRange) {
    formData.timeRange = null
  }

  // 重置自定义字段
  props.fields.forEach(field => {
    formData[field.prop] = getFieldDefault(field)
  })

  emit('reset')
  emit('search', { ...formData })
}

// 暴露方法给父组件
defineExpose({
  formData,
  handleSearch,
  handleReset
})
</script>

<style scoped lang="less">
.common-search {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
}

// 移动端样式
@media (max-width: 768px) {
  .common-search {
    padding: 12px;
  }

  .search-form {
    :deep(.el-form-item) {
      width: 100%;
      margin-right: 0;
      margin-bottom: 12px;
      display: block;

      .el-form-item__label {
        display: block;
        text-align: left;
        margin-bottom: 4px;
      }
    }

    :deep(.el-form-item__content) {
      width: 100%;
    }

    :deep(.el-input),
    :deep(.el-select),
    :deep(.el-date-editor) {
      width: 100% !important;
    }

    // 时间范围选择器适配
    :deep(.el-date-editor--datetimerange) {
      .el-input__wrapper {
        width: 100%;
      }
    }

    // 按钮适配 - 查询和重置按钮占满宽度
    :deep(.el-form-item) {
      // 只包含按钮的表单项（没有label）
      &:has(> .el-form-item__content > .el-button):not(:has(.el-form-item__label)) {
        display: block;

        .el-button {
          width: 100%;
        }
      }
    }
  }
}
</style>
