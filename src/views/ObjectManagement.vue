<!--
 * new page
 * @author: SAKANA267
 * @since: 2025-10-28
 * ObjectManagement.vue
-->
<template>
  <div class="container">

    <div class="header">
      <el-button type="primary" @click="dialogFormVisible = true">新增对象</el-button>
      <el-form :inline="true" :model="formInline">
        <el-form-item>
          <el-input placeholder="请输入查询内容" v-model="formInline.keyWord" :prefix-icon="Search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="object-table">
      <CommonTable :tableLabel="tableLabel"/>
    </div>

    <!--新增用户对话框-->
    <el-dialog v-model="dialogFormVisible" title="新增对象" :width="isMobile? '90%': '50%'" :before-close="handleClose">
      <el-form :model="form" :rules="rules" ref="objectForm">
        <el-form-item label="日期" :label-width="labelWidth" prop="date">
          <el-date-picker v-model="form.date" placeholder="选择日期" value-format="YYYY-MM-DD"/>
        </el-form-item>
        <el-form-item label="姓名" :label-width="labelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="地址" :label-width="labelWidth" prop="address">
          <el-input v-model="form.address" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, reactive, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue';

const { proxy } = getCurrentInstance();

//表格列配置
const tableLabel = [
    { prop: 'date', label: '日期', width:"110"},
    { prop: 'name', label: '姓名', width:"80"},
    { prop: 'address', label: '地址', },
]

const tableData = ref([
  {
    id: 0,
    date: '加载中',
    name: '加载中',
    address: '加载中'
  },
])
const formInline = reactive({
  keyWord: ''
})
const config = reactive({
  name: '',
  totle: 0,
  page: 1,
})

const getTableData = async () => {
  const table = await proxy?.$api.getTableData(config);
  tableData.value = table.list;
  console.log('tableData', table.list);
  config.totle = table.count;
  console.log('totle', config.totle);
}

const handleSearch = () => {
  config.name = formInline.keyWord
  getTableData()
}
const handleChange = (page) => {
  config.page = page;
  getTableData()
}

const handleEdit = (row) => {
  console.log('编辑', row)
}

const handleDelete = (val) => {
  ElMessageBox.confirm("是否确认删除该对象?", '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      await proxy?.$api.deleteObject({ id: val.id })
      ElMessage({
        showClose: true,
        message: '删除成功',
        type: 'success',
      })
      await getTableData()
      console.log('删除', val)
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      })
    })
}

//对话框表单相关
const dialogFormVisible = ref(false)
const form = reactive({
  date: '',
  name: '',
  address: '',
})
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
const objectForm = ref({})
const handleClose = (done) => {
  ElMessageBox.confirm('确定要关闭对话框吗?')
    .then(() => {
      objectForm.value.resetFields()
      dialogFormVisible.value = false
      done()
    })
    .catch(() => {
      // catch error
    })
}
const handleSubmit = async () => {
  await objectForm.value.validate(async (valid) => {
    if (valid) {
      try {
        await proxy?.$api.createObject(form)
        ElMessage({
          showClose: true,
          message: '创建成功',
          type: 'success',
        });
        dialogFormVisible.value = false
        objectForm.value.resetFields()
        await getTableData() // 添加这行来刷新表格数据
      } catch (error) {
        console.error('创建失败', error)
      }
    }else {
      console.log('表单验证失败')
    }
  })
}

onMounted(() => {
  getTableData()
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
