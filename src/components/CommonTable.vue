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
          <el-tag :type="getStatusTagType(scope.row[statusColumnProp])" size="small">
            {{ scope.row[statusColumnProp] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <!-- 编辑删除模式（默认） -->
          <template v-if="showEditDeleteButtons">
            <el-button
              :disabled="permissions?.canEdit === false"
              type="text"
              @click="handleEdit(scope.row)"
              size="small"
            >
              编辑
            </el-button>
            <el-button
              :disabled="permissions?.canDelete === false"
              type="text"
              size="small"
              :style="{ color: permissions?.canDelete === false ? '#909399' : '#f56c6c' }"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
          <!-- 审核模式 -->
          <template v-if="showAuditButton">
            <el-button
              :disabled="permissions?.canAudit !== true || scope.row[statusColumnProp] !== '待审核'"
              type="text"
              @click="emit('audit', scope.row)"
              size="small"
            >
              审核
            </el-button>
            <el-button
              :disabled="
                permissions?.canRevoke !== true || scope.row[statusColumnProp] === '待审核'
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
            {{ statusColumn.label }}: {{ scope.row[statusColumnProp] }}
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
          <el-tag :type="getStatusTagType(scope.row[statusColumnProp])" size="small">
            {{ scope.row[statusColumnProp] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <!-- 审核模式 -->
          <template v-if="showAuditButton">
            <el-button
              :disabled="permissions?.canAudit !== true || scope.row[statusColumnProp] !== '待审核'"
              type="text"
              @click="emit('audit', scope.row)"
              size="small"
            >
              审核
            </el-button>
            <el-button
              :disabled="
                permissions?.canRevoke !== true || scope.row[statusColumnProp] === '待审核'
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

<script setup lang="ts">
/**
 * @component CommonTable
 * @description 通用表格组件，支持响应式布局，包含表格展示、分页、增删改查、审核功能
 *
 * @props {Array} tableLabel - 表格列配置数组，每个元素包含 prop(字段名)、label(显示名)、width(宽度)属性
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
 * @expose search(params?) - 刷新表格数据方法，可传入搜索参数对象
 *
 * @example 编辑删除模式（默认）
 * <CommonTable
 *   ref="tableRef"
 *   :tableLabel="[
 *     { prop: 'date', label: '日期', width: '110' },
 *     { prop: 'name', label: '姓名', width: '80' }
 *   ]"
 *   :getApi="getTableData"
 *   :deleteApi="deleteData"
 *   @edit="handleEdit"
 * />
 *
 * // 调用搜索方法
 * tableRef.value?.search({ keyword: '搜索词', status: 'active' })
 *
 * @example 审核模式
 * <CommonTable
 *   :tableLabel="tableLabel"
 *   :getApi="getTableData"
 *   operationMode="audit"
 *   :statusColumn="{ prop: 'status', label: '状态', width: '100' }"
 *   :statusTagTypes="{ '待审核': 'warning', '已审核': 'success' }"
 *   @audit="handleAudit"
 * /> */

import { ref, onMounted, reactive, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

// 类型定义
interface TableLabelItem {
  prop: string
  label: string
  width?: string
  minWidth?: string
}

interface StatusColumn {
  prop: string
  label: string
  width?: string
}

interface Permissions {
  canEdit?: boolean
  canDelete?: boolean
  canAudit?: boolean
  canRevoke?: boolean
}

//组件属性定义
const props = defineProps<{
  tableLabel: TableLabelItem[]
  getApi: (params: any) => Promise<any>
  deleteApi?: (id: any) => Promise<any>
  operationMode?: 'edit-delete' | 'audit'
  statusColumn?: StatusColumn | null
  statusTagTypes?: Record<string, string>
  permissions?: Permissions
}>()

//表格数据
const tableData = ref([])

const config = reactive({
  totle: 0,
  page: 1,
  size: 10
})

// 搜索参数（支持动态传入）
const searchParams = ref<Record<string, any>>({})

// 计算属性：显示哪些操作按钮
const showAuditButton = computed(() => props.operationMode === 'audit')
const showEditDeleteButtons = computed(
  () => props.operationMode === 'edit-delete' || props.operationMode === undefined
)

// 类型安全的状态标签类型获取
const statusTagTypes = computed(
  () =>
    props.statusTagTypes || {
      待审核: 'warning',
      已审核: 'success',
      审核不通过: 'danger'
    }
)

// 获取状态列属性名（用于模板中的动态索引）
const statusColumnProp = computed(() => props.statusColumn?.prop || 'status')

const getTableData = async () => {
  try {
    // 合并分页参数和搜索参数
    const params = {
      page: config.page,
      size: config.size,
      ...searchParams.value
    }
    const res = await props.getApi(params)
    tableData.value = res.records
    console.log('tableData', res.records)
    config.totle = res.total
    console.log('totle', config.totle)
  } catch (error) {
    console.error('获取表格数据失败:', error)
  }
}
//暴露搜索方法，支持传入搜索参数
const search = (params?: Record<string, any>) => {
  if (params) {
    // 传入参数时，更新搜索条件
    searchParams.value = { ...params }
    // 重置到第一页
    config.page = 1
  }
  // 不传参数时，保持现有搜索条件，仅刷新数据
  getTableData()
}

//分页
const handleChange = (page: number) => {
  config.page = page
  getTableData()
}

//删除对象
const handleDelete = (val: any) => {
  ElMessageBox.confirm('是否确认删除该对象?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        console.log('要删除的对象id:', val.id)
        await props.deleteApi?.(val.id)

        // 能执行到这里说明 code=200，删除成功
        ElMessage.success('删除成功')
        await getTableData()
        console.log('删除了', val)
      } catch (error) {
        console.error('删除操作失败:', error)
        ElMessage.error((error as any).message || '删除操作失败，请重试')
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除'
      })
    })
}

const emit = defineEmits<{
  edit: [row: any]
  audit: [row: any]
  revoke: [row: any]
}>()

const handleEdit = (row: any) => {
  console.log('handleEdit()编辑对象:', row)
  emit('edit', row)
}

// 撤回审核
const handleRevoke = (row: any) => {
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
const getStatusTagType = (status: string) => {
  return statusTagTypes.value[status] || 'info'
}

onMounted(() => {
  // 初始加载时不带搜索参数
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
  width: 95%;
  margin: 0 auto;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

@media screen and (max-width: 768px) {
  /* 隐藏桌面端表格 */
  .table {
    display: none;
    width: 100%;
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
