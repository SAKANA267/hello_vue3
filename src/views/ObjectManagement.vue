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
      <el-form :inline="true">
        <el-form-item label="请输入">
          <el-input placeholder="请输入查询内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance} from 'vue'
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
const getTableData = async () => {
  const table = await proxy?.$api.getTableData();
  tableData.value = table;
  console.log('tableData', table);
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
</script>

<style scoped>
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table{
  background: #fff;
  padding: 20px;
  border-radius: 2px;
}
</style>
