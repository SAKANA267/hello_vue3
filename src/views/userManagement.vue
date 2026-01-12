<!--
 * new page
 * @author: SAKANA267
 * @since: 2026-01-08
 * userManagement.vue
-->
<template>
  <div class="container">

    <div class="header">
      <el-form :inline="true" :model="formInline">
        <el-form-item>
          <el-button type="primary" @click="openDialog('add')">新增用户</el-button>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="请输入查询内容" v-model="formInline.keyWord" :prefix-icon="Search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <CommonTable 
      ref="tableRef" 
      :tableLabel="tableLabel" 
      :queryParams="formInline.keyWord"
      :getApi="proxy?.$api.getUserList" 
      :deleteApi="proxy?.$api.deleteUser"
      @edit="openDialog('edit', $event)"
    />
    

    <!--新增用户对话框-->
    <TableEditDialog 
      v-model="dialogVisible" 
      ref="tableEditDialogRef" 
      :formFields="formFields" 
      :rules="rules" 
      :action="dialogAction"
      :rowData="currentRow"
      :addApi="proxy?.$api.createUser" 
      :editApi="proxy?.$api.updateUser" 
      @refresh="handleSearch()"
    />

  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, reactive, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue';
import TableEditDialog from '@/components/TableEditDialog.vue';

const { proxy } = getCurrentInstance();
const tableRef = ref(null)
const tableEditDialogRef = ref(null)

//表格列配置 用于v-for创建表格列
const tableLabel = [
  { prop: 'username', label: '用户名', width: "120" },
  { prop: 'name', label: '姓名', width: "100" },
  { prop: 'email', label: '邮箱', width: "180" },
  { prop: 'phone', label: '电话', width: "130" },
  { prop: 'role', label: '角色', width: "100" },
  { prop: 'status', label: '状态', width: "100" },
  { prop: 'createTime', label: '创建时间', width: "180" },
  { prop: 'lastLogin', label: '最后登录', }
]
//编辑与创建用户 用于v-for创建编辑/新增表单
const formFields = [
  { prop: 'username', label: '用户名', type: 'input' },
  { prop: 'name', label: '姓名', type: 'input' },
  { prop: 'email', label: '邮箱', type: 'input' },
  { prop: 'phone', label: '电话', type: 'input' },
  { prop: 'role', label: '角色', type: 'select', options: ['admin', 'user', 'editor'] },
  { prop: 'status', label: '状态', type: 'select', options: ['active', 'inactive'] },
  { prop: 'createTime', label: '创建时间', type: 'date' },
  { prop: 'lastLogin', label: '最后登录', type: 'date' }
]

// 表单验证规则 用于el-form的rules属性
const rules = reactive({
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
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  createTime: [{ required: true, message: '请选择创建时间', trigger: 'change' }],
  lastLogin: [{ required: true, message: '请选择最后登录时间', trigger: 'change' }]
})


//搜索相关
const formInline = reactive({
  keyWord: ''
})
const handleSearch = () => {
  tableRef.value?.search()
}

//对话框表单相关
const dialogVisible = ref(false);
const dialogAction = ref('add');
const currentRow = ref(null);
const openDialog = (action, row = null) => {
  console.log('openDialog() row:', row);
  dialogAction.value = action;
  currentRow.value = row;
  dialogVisible.value = true;
};

onMounted(() => {

})

//响应式布局检测
const isMobile = ref(window.innerWidth <= 768)
const labelWidth = computed(() => isMobile.value ? '60px' : '100px')
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 768
})
</script>

<style scoped>
.mobile-cards {
  display: none;
}

.mobile-card-content {
  margin: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

#table {
  background: #fff;
  padding: 20px;
  border-radius: 2px;
  width: 90%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

@media screen and (max-width: 768px) {

  /* 隐藏桌面端表格 */
  .table {
    display: none;
  }

  /* 显示移动端卡片布局 */
  .mobile-cards {
    display: block;
    width: 100%;
  }

  /* 调整分页宽度 */
  .pagination {
    width: 100%;
    padding: 10px;
  }
}

.pagination {
  display: flex;
  margin-top: 20px;
  justify-content: center;
}
</style>
