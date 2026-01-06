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
        <el-form-item label="请输入">
          <el-input placeholder="请输入查询内容" v-model="formInline.keyWord"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 桌面端表格布局 -->
    <div id="table" v-show="!isMobile">
      <el-table :data="tableData" border style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }">
        <el-table-column prop="date" label="日期" width="110" />
        <el-table-column prop="name" label="姓名" width="80" />
        <el-table-column prop="address" label="地址" />
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)" type="text" size="small">
              编辑
            </el-button>
            <el-button @click="handleDelete(scope.row)" type="text" size="small" style="color: #f56c6c">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 移动端卡片布局 -->
    <div class="mobile-cards" v-show="isMobile">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template #default="props">
            <div class="mobile-card-content">
              <p>地址: {{ props.row.address }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="日期" prop="date" />
        <el-table-column label="姓名" prop="name" />
      </el-table>
    </div>
    <!--分页-->
    <div class="pagination">
      <el-pagination :background=!isMobile layout="prev, pager, next" :total="config.totle"
        :size="isMobile ? 'small' : 'large'" @current-change="handleChange" />
    </div>

    <!--新增用户对话框-->
    <el-dialog v-model="dialogFormVisible" title="新增对象" width="50%" :before-close="handleClose">
      <el-form :model="form" :rules="rules" ref="objectForm">
        <el-form-item label="日期" label-width="80px" prop="date">
          <el-input v-model="form.date" autocomplete="off" />
        </el-form-item>
        <el-form-item label="姓名" label-width="80px" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="地址" label-width="80px" prop="address">
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
import { ref, onMounted, getCurrentInstance, reactive } from 'vue'

const { proxy } = getCurrentInstance();

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
  date: [{ required: true, message: '请输入日期', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
})
const objectForm = ref({})
const handleClose = (done) => {
  ElMessageBox.confirm('确定要关闭对话框吗?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
const handleSubmit = async () => {
  if (!objectForm.value) return
  await objectForm.value.validate((valid) => {
    if (valid) {
      dialogFormVisible.value = false
    }
  })
}

onMounted(() => {
  getTableData()
})

const isMobile = ref(window.innerWidth <= 768)

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
