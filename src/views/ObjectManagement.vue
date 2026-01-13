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
          <el-button type="primary" @click="openDialog('add', null)">新增对象</el-button>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="请输入查询内容" v-model="formInline.keyWord" :prefix-icon="Search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="object-table">
      <CommonTable 
      ref="tableRef" 
      :tableLabel="tableLabel" 
      :queryParams="formInline.keyWord"
      :getApi="proxy?.$api.getTableData"
      :deleteApi="proxy?.$api.deleteObject"
      @edit="openDialog('edit', $event)"
    />
    </div>

    <!--新增用户对话框-->
    <TableEditDialog 
      v-model="dialogVisible" 
      ref="tableEditDialogRef"
      :dialogVisible ="dialogVisible"
      :formFields="formFields" 
      :rules="rules" 
      :action="dialogAction"
      :rowData="currentRow"
      :addApi="proxy?.$api.createObject" 
      :editApi="proxy?.$api.updateObject" 
      @refresh="handleSearch()"
      @update:dialogVisible="dialogVisible = $event"
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

//表格列配置
const tableLabel = [
    { prop: 'date', label: '日期', width:"110"},
    { prop: 'name', label: '姓名', width:"80"},
    { prop: 'address', label: '地址', },
]

//编辑与创建用户 用于v-for创建编辑/新增表单
const formFields = [
    { prop: 'date', label: '日期', type: 'date' },
    { prop: 'name', label: '姓名', type: 'input' },
    { prop: 'address', label: '地址', type: 'input' }
]

// 表单验证规则 用于el-form的rules属性
const rules = reactive({
  date: [{ required: true, message: '请输入日期', trigger: 'blur' },
  {
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    message: '日期格式必须为 yyyy-MM-dd',
    trigger: 'blur'
  }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
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
