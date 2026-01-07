<!--
 * new page
 * @author: SAKANA267
 * @since: 2026-01-07
 * CommonTable.vue
-->
<template>
    <!-- 桌面端表格布局 -->
    <div id="table" v-show="!isMobile">
        <el-table :data="tableData" border style="width: 100%"
            :header-cell-style="{ background: '#f5f7fa', color: '#606266' }">
            <el-table-column v-for="item in tableLabel" :label="item.label" :key="item.prop" :width="item.width ? item.width : ''"
                :prop="item.prop">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template #default="scope">
                    <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="handleDelete(scope.row)" type="text" size="small" style="color: #f56c6c">删除</el-button>
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
</template>

<script setup>
/**
 * @component CommonTable
 * @description 通用表格组件，支持响应式布局
 * @props {Array} tableLabel - 表格列配置
 * @example
 * <CommonTable :tableLabel="[
 *   { prop: 'date', label: '日期', width: '110' },
 *   { prop: 'name', label: '姓名', width: '80' }
 * ]" />
 */
import { ref, onMounted, getCurrentInstance, reactive, computed } from 'vue'

const { proxy } = getCurrentInstance();

//表格列配置
const props = defineProps({
  tableLabel: {
    type: Array,
    required: true,
    default: () => []
  }
})

const formInline = reactive({
    keyWord: ''
})

//获取表格数据
const tableData = ref([
    {
        id: 0,
        date: '加载中',
        name: '加载中',
        address: '加载中'
    },
])
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
//分页
const handleChange = (page) => {
    config.page = page;
    getTableData()
}
//删除对象
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
