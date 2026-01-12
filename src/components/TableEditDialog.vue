<!--
 * new page
 * @author: SAKANA267
 * @since: 2026-01-08
 * TableEditDialog.vue
-->
<template>
  <el-dialog v-model="dialogFormVisible" :title="dialogTitle" :width="isMobile ? '90%' : '50%'" :before-close="handleClose">
    <el-form :model="form" :rules="rules" ref="objectForm">
      <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
        <el-input v-if="field.type === 'input'" v-model="form[field.prop]" />
        <el-select v-else-if="field.type === 'select'" v-model="form[field.prop]">
          <el-option v-for="option in field.options" :key="option" :label="option" :value="option" />
        </el-select>
        <el-date-picker v-else-if="field.type === 'date'" v-model="form[field.prop]" type="date" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
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
import { ref, reactive, computed, watch} from 'vue'

//组件属性定义
const props = defineProps({
  formFields: Array,
  rules: Object,
  action: String,
  rowData: Object,
  addApi: Function,
  editApi: Function,
})

const emit = defineEmits(['refresh']);

const dialogFormVisible = ref(false);
// 初始化表单数据
const initForm = (fields) => {
  const form = {};
  fields.forEach((field) => {
    form[field.prop] = '';
  });
  console.log('initForm', form);
  return form;
};
//表单数据 用于el-form的model属性
const form = reactive(initForm(props.formFields))
const dialogTitle = computed(() => (props.action === 'edit' ? '编辑对象' : '新增对象'));

//对话框
const dialogAction = ref(props.action) // 当前操作类型 add/edit
//编辑与创建用户 用于v-for创建编辑/新增表单
const formFields = props.formFields
// 表单验证规则 用于el-form的rules属性
const rules = reactive(props.rules)

// 监听 rowData 变化，用于编辑时填充数据
watch(() => props.rowData, (newVal) => {
  if (newVal) {
    // 编辑时填充数据
    props.formFields.forEach(field => {
      form[field.prop] = newVal[field.prop] || ''
    })
  } else {
    // 新增时重置表单
    initForm(props.formFields)
  }
}, { immediate: true })

const handleClose = (done) => {
  ElMessageBox.confirm('确定要关闭对话框吗?')
    .then(() => {
      console.log('formFileds', formFields);
      dialogFormVisible.value = false
      done()
    })
    .catch(() => {
      // catch error
    })
}

const objectForm = ref(null);

const resetForm = () => {
  objectForm.value?.resetFields();
};

const handleSubmit = async () => {
  try {
    if (props.action === 'add') {
      const res = await props.addApi(form);
      if (res.success) {
        ElMessage.success('新增成功');
        resetForm();
        dialogFormVisible.value = false;
        emit('refresh');
      } else {
        ElMessage.error('新增失败');
      }
    } else {
      const updateData = {
        id: props.rowData.id,
        ...form
      };
      const res = await props.editApi(updateData);
      if (res.success) {
        ElMessage.success('编辑成功');
        resetForm();
        dialogFormVisible.value = false;
        emit('refresh');
      } else {
        ElMessage.error('编辑失败');
      }
    }
  } catch (error) {
    console.error(error);
  }
};



//响应式布局检测
const isMobile = ref(window.innerWidth <= 768)
const labelWidth = computed(() => isMobile.value ? '60px' : '100px')
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 768
})
</script>

<style scoped>

</style>
