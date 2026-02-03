<!--
 * new page
 * @author: SAKANA267
 * @since: 2026-01-07
 * CommonTable.vue
-->
<template>
  <!-- 桌面端表格布局 -->
  <div v-show="!isMobile" id="table">
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
    >
      <el-table-column
        v-for="item in tableLabel"
        :key="item.prop"
        :label="item.label"
        :width="item.width ? item.width : ''"
        :prop="item.prop"
        :sortable="/date/i.test(item.prop) || item.label.includes('日期') ? true : false"
      />
      <!-- 状态标签列 -->
      <el-table-column
        v-if="statusColumn"
        :label="statusColumn.label"
        :width="statusColumn.width || ''"
      >
        <template #default="scope">
          <el-tag :type="getStatusTagType(scope.row[statusColumn.prop])" size="small">
            {{ scope.row[statusColumn.prop] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <!-- 编辑删除模式（默认） -->
          <template v-if="showEditDeleteButtons">
            <el-button
              v-if="permissions?.canEdit !== false"
              type="text"
              @click="handleEdit(scope.row)"
              size="small"
            >
              编辑
            </el-button>
            <el-button
              v-if="permissions?.canDelete !== false"
              type="text"
              size="small"
              style="color: #f56c6c"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
          <!-- 审核模式 -->
          <template v-if="showAuditButton">
            <el-button
              :disabled="
                permissions?.canAudit !== true || scope.row[statusColumn?.prop] !== '待审核'
              "
              type="text"
              @click="emit('audit', scope.row)"
              size="small"
            >
              审核
            </el-button>
            <el-button
              :disabled="
                permissions?.canRevoke !== true || scope.row[statusColumn?.prop] === '待审核'
              "
              type="text"
              size="small"
              @click="handleRevoke(scope.row)"
            >
              撤回
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 移动端卡片布局 -->
  <div v-show="isMobile" class="mobile-cards">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template #default="scope">
          <div v-for="item in tableLabel" :key="item.prop" class="mobile-card-content">
            <p v-if="item.prop !== 'name'">{{ item.label }}: {{ scope.row[item.prop] }}</p>
          </div>
          <!-- 状态信息（移动端展开时显示） -->
          <p v-if="statusColumn" class="mobile-card-content">
            {{ statusColumn.label }}: {{ scope.row[statusColumn.prop] }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" />
      <!-- 状态标签列（移动端） -->
      <el-table-column
        v-if="statusColumn"
        :label="statusColumn.label"
        :width="statusColumn.width || '100'"
      >
        <template #default="scope">
          <el-tag :type="getStatusTagType(scope.row[statusColumn.prop])" size="small">
            {{ scope.row[statusColumn.prop] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <!-- 审核模式 -->
          <template v-if="showAuditButton">
            <el-button
              :disabled="
                permissions?.canAudit !== true || scope.row[statusColumn?.prop] !== '待审核'
              "
              type="text"
              @click="emit('audit', scope.row)"
              size="small"
            >
              审核
            </el-button>
            <el-button
              :disabled="
                permissions?.canRevoke !== true || scope.row[statusColumn?.prop] === '待审核'
              "
              type="text"
              @click="handleRevoke(scope.row)"
              size="small"
            >
              撤回
            </el-button>
          </template>
          <!-- 编辑删除模式（默认） -->
          <template v-if="showEditDeleteButtons">
            <el-button type="text" @click="handleEdit(scope.row)" size="small"> 编辑 </el-button>
            <el-button
              type="text"
              size="small"
              style="color: #f56c6c"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!--分页-->
  <div class="pagination">
    <el-pagination
      :background="!isMobile"
      layout="prev, pager, next"
      :total="config.totle"
      :size="isMobile ? 'small' : 'large'"
      @current-change="handleChange"
    />
  </div>
</template>

<script setup>
/**
 * @component CommonTable
 * @description 通用表格组件，支持响应式布局，包含表格展示、分页、增删改查、审核功能
 *
 * @props {Array} tableLabel - 表格列配置数组，每个元素包含 prop(字段名)、label(显示名)、width(宽度)属性
 * @props {String} queryParams - 查询参数，用于表格数据筛选
 * @props {Function} getApi - 获取表格数据的API方法
 * @props {Function} deleteApi - 删除表格数据的API方法
 * @props {String} operationMode - 操作模式：'edit-delete'（默认，编辑删除）或 'audit'（审核）
 * @props {Object} statusColumn - 状态列配置 { prop: 'status', label: '状态', width: '100' }
 * @props {Object} statusTagTypes - 状态标签类型映射 { '待审核': 'warning', '已审核': 'success', ... }
 *
 * @emits edit - 编辑事件，传递当前行数据
 * @emits audit - 审核事件，传递当前行数据
 * @emits revoke - 撤回事件，传递当前行数据
 *
 * @expose search - 刷新表格数据方法
 *
 * @example 编辑删除模式（默认）
 * <CommonTable
 *   :tableLabel="[
 *     { prop: 'date', label: '日期', width: '110' },
 *     { prop: 'name', label: '姓名', width: '80' }
 *   ]"
 *   :queryParams="searchKeyword"
 *   :getApi="getTableData"
 *   :deleteApi="deleteData"
 *   @edit="handleEdit"
 * />
 *
 * @example 审核模式
 * <CommonTable
 *   :tableLabel="tableLabel"
 *   :getApi="getTableData"
 *   operationMode="audit"
 *   :statusColumn="{ prop: 'status', label: '状态', width: '100' }"
 *   :statusTagTypes="{ '待审核': 'warning', '已审核': 'success' }"
 *   @audit="handleAudit"
 * />
 */

import { ref, onMounted, reactive, computed } from 'vue'

//组件属性定义
const props = defineProps({
  tableLabel: {
    type: Array,
    default: () => []
  },
  queryParams: {
    type: String,
    required: false,
    default: ''
  },
  getApi: {
    type: Function,
    required: false,
    default: () => ({})
  },
  deleteApi: {
    type: Function,
    required: false,
    default: () => ({})
  },
  // 审核模式：'edit-delete' 或 'audit'
  operationMode: {
    type: String,
    default: 'edit-delete'
  },
  // 状态列配置
  statusColumn: {
    type: Object,
    default: null
  },
  // 状态标签类型映射
  statusTagTypes: {
    type: Object,
    default: () => ({
      待审核: 'warning',
      已审核: 'success',
      审核不通过: 'danger'
    })
  },
  // 权限配置
  permissions: {
    type: Object,
    default: () => ({
      canEdit: true,
      canDelete: true,
      canAudit: true,
      canRevoke: true
    })
  }
})

//表格数据
const tableData = ref([])

const config = reactive({
  keyword: '',
  totle: 0,
  page: 1
})

// 计算属性：显示哪些操作按钮
const showAuditButton = computed(() => props.operationMode === 'audit')
const showEditDeleteButtons = computed(() => props.operationMode === 'edit-delete')
const getTableData = async () => {
  try {
    const res = await props.getApi(config)
    tableData.value = res.records
    console.log('tableData', res.records)
    config.totle = res.total
    console.log('totle', config.totle)
  } catch (error) {
    console.error('获取表格数据失败:', error)
  }
}
//暴露搜索方法
const search = () => {
  config.keyword = props.queryParams || ''
  getTableData()
}

//分页
const handleChange = page => {
  config.page = page
  getTableData()
}
//删除对象
const handleDelete = val => {
  ElMessageBox.confirm('是否确认删除该对象?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        console.log('要删除的对象id:', val.id)
        await props.deleteApi(val.id)

        // 能执行到这里说明 code=200，删除成功
        ElMessage.success('删除成功')
        await getTableData()
        console.log('删除了', val)
      } catch (error) {
        console.error('删除操作失败:', error)
        ElMessage.error(error.message || '删除操作失败，请重试')
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除'
      })
    })
}

const emit = defineEmits(['edit', 'audit', 'revoke'])
const handleEdit = row => {
  console.log('handleEdit()编辑对象:', row)
  emit('edit', row)
}

// 撤回审核
const handleRevoke = row => {
  ElMessageBox.confirm('是否确认撤回该审核记录？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      emit('revoke', row)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消撤回'
      })
    })
}

// 获取状态标签类型
const getStatusTagType = status => {
  return props.statusTagTypes[status] || 'info'
}

onMounted(() => {
  getTableData()
})

//响应式布局检测
const isMobile = ref(window.innerWidth <= 768)
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 768
})

// 使用defineExpose暴露方法
defineExpose({
  search
})
</script>

<style scoped>
.mobile-cards {
  display: none;
}

.mobile-card-content {
  margin-left: 20px;
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
