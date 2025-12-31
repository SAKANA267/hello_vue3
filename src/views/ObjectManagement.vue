<!--
 * new page
 * @author: SAKANA267
 * @since: 2025-10-28
 * ObjectManagement.vue
-->
<template>
  <div class="container">

    <div class="header">
      <el-button type="primary">新增对象</el-button>
      <el-form :inline="true" :model="formInline">
        <el-form-item label="请输入">
          <el-input placeholder="请输入查询内容" v-model="formInline.keyWord"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table">
      <el-table :data="tableData" border style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }">
        <el-table-column prop="date" label="日期" width="180" />
        <el-table-column prop="name" label="姓名" width="180" />
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
    <div class="mobile-cards">
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

    <div class="pagination">
      <el-pagination 
        :background = !isMobile
        layout="prev, pager, next" 
        :total="config.totle" 
        :size="isMobile ? 'small' : 'large'" 
        @current-change="handleChange"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance, reactive } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import type { TableItem } from '@/assets/types/objectTable.ts'

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const tableData = ref<TableItem[]>([
  {
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
  totle:0,
  page:1,
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
const handleChange = (page: number) => {
  config.page = page;
  getTableData()
}

const handleEdit = (row: TableItem) => {
  console.log('编辑', row)
}

const handleDelete = (row: TableItem) => {
  console.log('删除', row)
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

.table {
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
