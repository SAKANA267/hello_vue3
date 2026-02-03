<!--
 * new page
 * @author: SAKANA267
 * @since: 2026-01-08
 * TableEditDialog.vue
-->
<template>
  <el-dialog
    :model-value="dialogVisible"
    :title="dialogTitle"
    :width="isMobile ? '90%' : '50%'"
    :before-close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="objectForm">
      <el-form-item
        v-for="field in formFields"
        :key="field.prop"
        :label="field.label"
        :prop="field.prop"
      >
        <el-input v-if="field.type === 'input'" v-model="form[field.prop]" :disabled="field.disabled" />
        <el-select
          v-else-if="field.type === 'select'"
          v-model="form[field.prop]"
          placeholder="请选择"
          :disabled="field.disabled"
        >
          <el-option
            v-for="option in field.options"
            :key="typeof option === 'object' ? option.value : option"
            :label="typeof option === 'object' ? option.label : option"
            :value="typeof option === 'object' ? option.value : option"
          />
        </el-select>
        <el-radio-group v-else-if="field.type === 'radio'" v-model="form[field.prop]">
          <el-radio
            v-for="option in field.options"
            :key="typeof option === 'object' ? option.value : option"
            :label="typeof option === 'object' ? option.value : option"
          >
            {{ typeof option === 'object' ? option.label : option }}
          </el-radio>
        </el-radio-group>
        <el-date-picker
          v-else-if="field.type === 'date'"
          v-model="form[field.prop]"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择日期"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleSubmit"> 提交 </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
/**
 * @component TableEditDialog
 * @description 通用表单编辑对话框组件，支持新增和编辑功能，包含表单验证、提交处理
 * @props {Array} formFields - 表单字段配置数组，每个元素包含 prop(字段名)、label(显示名)、type(类型)、options(选项，仅select类型需要)属性
 * @props {Object} rules - 表单验证规则对象，字段名对应验证规则数组
 * @props {String} action - 操作类型，'add'表示新增，'edit'表示编辑
 * @props {Object} rowData - 编辑时的行数据，用于填充表单
 * @props {Function} addApi - 新增数据的API方法
 * @props {Function} editApi - 编辑数据的API方法
 * @emits {String} refresh - 表单提交成功后触发，用于刷新列表数据
 * @example
 * <TableEditDialog
 *   v-model="dialogVisible"
 *   :formFields="[
 *     { prop: 'username', label: '用户名', type: 'input' },
 *     { prop: 'role', label: '角色', type: 'select', options: ['admin', 'user'] }
 *   ]"
 *   :rules="formRules"
 *   :action="dialogAction"
 *   :rowData="currentRow"
 *   :addApi="createUser"
 *   :editApi="updateUser"
 *   @refresh="handleRefresh"
 * />
 */
import { ElMessage } from 'element-plus'
import { ref, reactive, computed, watch } from 'vue'

//组件属性定义
const props = defineProps({
  dialogVisible: Boolean,
  formFields: Array,
  rules: Object,
  action: String,
  rowData: Object,
  addApi: Function,
  editApi: Function
})

const emit = defineEmits(['update:dialogVisible', 'refresh'])

// 初始化表单数据
const initForm = fields => {
  fields.forEach(field => {
    form[field.prop] = ''
  })
}

//表单数据 用于el-form的model属性
const form = reactive({})
initForm(props.formFields)

const dialogTitle = computed(() => (props.action === 'edit' ? '编辑对象' : '新增对象'))

// 表单字段 - 使用 computed 响应式更新
const formFields = computed(() => props.formFields)
// 表单验证规则 - 使用 computed 响应式更新
const rules = computed(() => props.rules)

// 根据 action 初始化表单
const initializeForm = () => {
  if (props.action === 'edit' && props.rowData) {
    // 编辑时填充数据
    props.formFields.forEach(field => {
      form[field.prop] = props.rowData[field.prop] || ''
    })
  } else if (props.action === 'add') {
    // 新增时重置表单
    initForm(props.formFields)
  }
}
// 每次打开对话框时初始化表单
const dialogVisible = computed(() => props.dialogVisible)
watch(
  dialogVisible,
  visible => {
    if (visible) {
      initializeForm() // 根据 action 初始化表单
    }
  },
  { immediate: true }
)

const handleClose = () => {
  initForm(props.formFields)
  emit('update:dialogVisible', false)
}

const handleSubmit = async () => {
  try {
    if (props.action === 'add') {
      const res = await props.addApi(form)
      if (res) {
        ElMessage.success('新增成功')
        emit('update:dialogVisible', false)
        initForm(props.formFields)
        emit('refresh')
      } else {
        ElMessage.error('新增失败')
      }
    } else {
      // 编辑：统一使用两参数 API editApi(id, data)
      const res = await props.editApi(props.rowData.id, form)
      if (res) {
        ElMessage.success('编辑成功')
        emit('update:dialogVisible', false)
        initForm(props.formFields)
        emit('refresh')
      }
    }
  } catch (error) {
    console.error(error)
    ElMessage.error(error.message || '操作失败')
  }
}

//响应式布局检测
const isMobile = ref(window.innerWidth <= 768)
const labelWidth = computed(() => (isMobile.value ? '60px' : '100px'))
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 768
})
</script>

<style scoped></style>
